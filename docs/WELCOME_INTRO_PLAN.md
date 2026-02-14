# Kế hoạch: Hiệu ứng Intro / Xuất hiện mượt sau khi Login

## Mục tiêu
Sau khi user đăng nhập thành công và vào trang Book (home), hiển thị một **intro chào mừng** ngắn, sinh động rồi mới lộ nội dung chính.

## Cách triển khai

### 1. Kích hoạt intro
- Sau khi login thành công (credentials hoặc guest), redirect tới **`/?welcome=1`** thay vì `/`.
- Chỉ trang home đọc query `welcome=1` và hiển thị overlay intro; các route khác không bị ảnh hưởng.

### 2. Thành phần
- **WelcomeIntro** (client component): overlay full màn hình, nền tối đồng bộ với app.
- **Nội dung intro (khoảng 2–2.5s)**:
  - Logo / tên "BookWise" xuất hiện (scale + fade in).
  - Dòng chữ "Welcome back" (hoặc "Welcome to your library") fade in, có thể stagger từng từ.
  - Vài hình trang trí nhẹ (sách, bookmark) float / fade để tạo cảm giác “sống”.
- **Kết thúc**: fade out overlay (~0.5s), gọi `router.replace('/')` để xóa `?welcome=1` → re-render không còn intro, nội dung home hiện bình thường.

### 3. Kỹ thuật
- **CSS keyframes** cho: fade in/out, scale, stagger (không thêm dependency).
- **React state + useEffect**: set timeout để chạy fade-out rồi `router.replace('/')`.
- **Chỉ render intro khi** `searchParams.welcome === '1'` (truyền từ server component home xuống client wrapper).

### 4. Trải nghiệm
- Intro chỉ xuất hiện **một lần** mỗi lần vào trang với `?welcome=1` (sau login).
- Không chặn scroll lâu; tổng thời gian ~2.5s.
- Màu sắc dùng **primary** (beige) và **light-100** để nhất quán với theme.

## File liên quan
- `components/WelcomeIntro.tsx` – overlay + animation.
- `app/globals.css` – keyframes cho welcome intro.
- `app/(root)/page.tsx` – nhận `searchParams`, bọc nội dung bằng wrapper có `welcome={searchParams?.welcome === '1'}`.
- `components/AuthForm.tsx` – đổi `router.push("/")` thành `router.push("/?welcome=1")` khi login thành công.
