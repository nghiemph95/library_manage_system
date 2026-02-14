# Seed Admin User

Script để tạo admin user ban đầu (root user) với role ADMIN và status APPROVED.

## Cách sử dụng

1. Thêm biến môi trường vào `.env.local`
2. Chạy: `npm run seed:user`

## Biến môi trường (bắt buộc)

Thêm vào `.env.local`:

```env
ADMIN_EMAIL=admin@bookwise.local
ADMIN_PASSWORD=Admin123!
ADMIN_FULL_NAME=Admin
ADMIN_UNIVERSITY_ID=1
ADMIN_UNIVERSITY_CARD=ids/admin-placeholder.png
```

| Biến | Mô tả |
|------|-------|
| ADMIN_EMAIL | Email đăng nhập admin (bắt buộc) |
| ADMIN_PASSWORD | Mật khẩu admin (bắt buộc) |
| ADMIN_FULL_NAME | Tên hiển thị (bắt buộc) |
| ADMIN_UNIVERSITY_ID | Mã số sinh viên/đại học - số nguyên, unique (bắt buộc) |
| ADMIN_UNIVERSITY_CARD | Path ảnh thẻ trên ImageKit (bắt buộc) |

## Guest user (tùy chọn)

Để bật đăng nhập "Continue as Guest" trên trang sign-in, thêm vào `.env.local`:

```env
GUEST_EMAIL=guest@bookwise.com
GUEST_PASSWORD=Guest123!
```

Sau đó chạy lại `npm run seed:user`. Script sẽ tạo (hoặc cập nhật mật khẩu) user guest với `role: USER`, `status: APPROVED`. Nếu không set hai biến này, bước seed guest sẽ bị bỏ qua.

- Trên trang **Sign-in** sẽ xuất hiện nút **Continue as Guest**.
- User đăng nhập guest sẽ thấy banner gợi ý dùng tài khoản Admin demo (link LinkedIn).
- Trang **My Profile** của guest sẽ có đoạn text dẫn tới link credentials Admin.

## Lưu ý

- Script sẽ **exit(1)** nếu thiếu biến môi trường bắt buộc (admin)
- Script sẽ **không tạo** nếu admin với email đã tồn tại
- `ADMIN_UNIVERSITY_CARD`: Cần upload ảnh lên ImageKit trước, hoặc dùng path có sẵn
- Admin user có `role: ADMIN` và `status: APPROVED` – không cần approve qua Account Requests
