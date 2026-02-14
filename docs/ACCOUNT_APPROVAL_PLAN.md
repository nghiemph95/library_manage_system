# Implementation Plan: Approve/Reject Account Requests

## Tổng quan

Feature cho phép Admin duyệt (Approve) hoặc từ chối (Reject) các tài khoản user đang ở trạng thái PENDING trong trang Account Requests.

---

## Hiện trạng

| Thành phần | Trạng thái |
|------------|------------|
| Account Requests page | ✅ Có – hiển thị danh sách PENDING users |
| Approve/Reject buttons | ❌ Chưa có |
| Server actions | ❌ Chưa có |
| Email notification | ❌ Chưa có |

---

## Implementation Plan

### 1. Server Actions (`lib/admin/actions/user.ts`)

**Tạo file mới** – các server action:

```ts
// approveUser(userId: string)
// - Kiểm tra user hiện tại là ADMIN
// - Kiểm tra target user tồn tại và status = PENDING
// - Update status → "APPROVED"
// - Gửi email thông báo (optional)
// - Return { success, error? }

// rejectUser(userId: string)
// - Kiểm tra user hiện tại là ADMIN
// - Kiểm tra target user tồn tại và status = PENDING
// - Update status → "REJECTED"
// - Gửi email thông báo (optional)
// - Return { success, error? }
```

**Luồng xử lý:**
- Verify session và quyền ADMIN
- Query user theo `userId`
- Chỉ cho phép thao tác nếu `status === "PENDING"`
- Update DB
- (Optional) Gọi `sendEmail` từ `lib/workflow.ts`

---

### 2. UI Components

#### 2.1. Approve/Reject Buttons

**Vị trí:** `app/admin/account-requests/page.tsx` – thêm cột "Actions"

**Cách triển khai:**
- **Option A:** Dùng form + server action trực tiếp
  - Mỗi row có form với hidden `userId`, nút Approve/Reject
  - Gọi server action khi submit
- **Option B:** Client component với `useTransition`
  - Tạo `AccountRequestActions` client component
  - Nút Approve/Reject gọi server action
  - Hiển thị loading/error bằng toast
  - `router.refresh()` sau khi thành công

**Khuyến nghị:** Option B (client component) để có loading state và toast rõ ràng.

#### 2.2. Confirmation (Optional)

- Có thể thêm confirmation dialog trước khi Reject
- Approve có thể bỏ qua confirmation vì ít rủi ro hơn

---

### 3. Cập nhật Account Requests Page

**File:** `app/admin/account-requests/page.tsx`

**Thay đổi:**
1. Thêm cột **"Actions"** vào table
2. Import `AccountRequestActions`
3. Mỗi row render `<AccountRequestActions userId={user.id} />`

---

### 4. Component `AccountRequestActions`

**File:** `components/admin/AccountRequestActions.tsx` (client component)

**Props:** `userId: string`

**Chức năng:**
- Nút **Approve** – gọi `approveUser(userId)`
- Nút **Reject** – gọi `rejectUser(userId)`
- Loading state khi đang xử lý
- Toast success/error
- `router.refresh()` sau khi thành công

---

### 5. Email Notifications (Optional)

**Approve:**
- Gửi email thông báo tài khoản đã được duyệt
- Nội dung: "Your account has been approved. You can now borrow books."

**Reject:**
- Gửi email thông báo tài khoản bị từ chối
- Nội dung: "Unfortunately, your account request has been rejected. Contact admin for more information."

**Lưu ý:** Cần kiểm tra `RESEND_TOKEN` và `sendEmail` đã cấu hình đúng.

---

## File Structure

```
lib/admin/actions/user.ts          # Server actions (mới)
components/admin/AccountRequestActions.tsx  # Client component (mới)
app/admin/account-requests/page.tsx        # Cập nhật - thêm Actions column
```

---

## Checklist Implementation

- [x] 1. Tạo `lib/admin/actions/user.ts` với `approveUser` và `rejectUser` ✅
- [x] 2. Tạo `components/admin/AccountRequestActions.tsx` ✅
- [x] 3. Cập nhật `app/admin/account-requests/page.tsx` – thêm cột Actions ✅
- [ ] 4. Test flow Approve
- [ ] 5. Test flow Reject
- [ ] 6. (Optional) Thêm email notifications
- [x] 7. (Optional) Thêm confirmation dialog cho Reject ✅

---

## Security

- Chỉ user có `role === "ADMIN"` được gọi approve/reject
- Verify target user tồn tại và `status === "PENDING"`
- Không cho approve/reject user đã APPROVED/REJECTED

---

## Error Handling

- User không phải admin → return `{ success: false, error: "Unauthorized" }`
- User không tồn tại → return `{ success: false, error: "User not found" }`
- User không phải PENDING → return `{ success: false, error: "User is not pending" }`
- DB error → log và return `{ success: false, error: "Failed to update" }`
