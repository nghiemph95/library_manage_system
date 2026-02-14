# Kế hoạch: Guest Login & Referral Admin Demo

## Mục tiêu
- Cho phép khách không có tài khoản đăng nhập nhanh bằng "Continue as Guest" để xem sample.
- Sau khi đăng nhập guest, hiện thông báo hướng dẫn dùng tài khoản Admin demo (credentials trên LinkedIn của Nghiêm Phạm).
- Tăng behavior hợp lý: guest có thể trải nghiệm → biết có Admin demo → vào profile/LinkedIn để lấy credentials.

## Các bước thực hiện

### 1. Config & Env
- Thêm `GUEST_EMAIL`, `GUEST_PASSWORD` (optional, dùng khi seed và khi sign-in as guest).
- Trong `lib/config.ts`: thêm `guestEmail` (chỉ dùng phía server để nhận diện guest trong session).

### 2. Auth (NextAuth)
- JWT callback: lưu `email` vào token để dùng trong session.
- Session callback: `session.user.isGuest = (session.user.email === process.env.GUEST_EMAIL)`.
- Bổ sung type NextAuth: `session.user.isGuest?: boolean`.

### 3. Seed Guest User
- Trong `database/seed-user.ts` (hoặc script riêng): nếu có `GUEST_EMAIL` + `GUEST_PASSWORD`, tạo/update user Guest (role USER, status APPROVED, fullName "Guest User", universityId/card placeholder).

### 4. Server Action: signInAsGuest
- `lib/actions/auth.ts`: `signInAsGuest()` đọc `GUEST_EMAIL`, `GUEST_PASSWORD` từ env, gọi `signIn("credentials", { email, password, redirect: false })`, trả về cùng format như `signInWithCredentials`.

### 5. Sign-in Page & AuthForm
- Trang sign-in: truyền thêm action `signInAsGuest` (hoặc prop tương đương).
- AuthForm (khi type SIGN_IN): thêm nút/link "Continue as Guest" gọi `signInAsGuest()`; sau thành công redirect về "/" và có thể toast "Signed in as guest".

### 6. Guest Banner (sau khi đăng nhập)
- Component `GuestBanner`: client component nhận `session`.
- Nếu `session?.user?.isGuest` và chưa dismiss: hiện banner có nội dung kiểu: "You're browsing as a guest. To try the full Admin experience, demo credentials are on [Nghiêm Phạm's LinkedIn profile]." + link.
- Link: lưu trong constants (ví dụ `ADMIN_DEMO_CREDENTIALS_LINK`).
- Dismissible: nút đóng, lưu vào `localStorage` (e.g. `guest-banner-dismissed`) để không hiện lại.

### 7. Profile (My Profile)
- Nếu user là guest: hiện đoạn text/note phía trên: "Want to try Admin? Demo username & password are on [LinkedIn link]." để tăng referral hợp lý.

### 8. Constant Link
- Một nơi duy nhất lưu link LinkedIn (profile Nghiêm Phạm, nơi đặt credentials): dùng cho banner và profile.

## Luồng người dùng
1. Vào /sign-in → thấy "Continue as Guest" → click.
2. Đăng nhập guest thành công → redirect "/" → hiện GuestBanner (trừ khi đã dismiss).
3. Guest đọc banner → click link LinkedIn → xem credentials → có thể đăng xuất và đăng nhập lại bằng Admin.
4. Guest vào My Profile → thấy thêm note referral Admin demo với cùng link.
