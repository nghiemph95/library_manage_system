# Book Portal – Kế hoạch tính năng & nâng cao trải nghiệm

Tài liệu này tổng hợp **những gì còn thiếu**, **gợi ý giao diện đẹp mắt/hiện đại**, và **tính năng mới** cho Book (user) portal để gây ấn tượng với interviewer và nâng cao trải nghiệm người dùng.

---

## 1. Hiện trạng & khoảng trống

### 1.1 Đã có
- **Home**: Welcome intro, stats (borrowing / wishlist / due soon), shortcuts, borrowed preview, New arrivals, Popular.
- **Library**: Search (title/author), filter genre, New arrivals + Popular + All books (chưa phân trang).
- **Wishlist**: Danh sách sách yêu thích, link sang Library.
- **My Profile**: Borrowed books, Borrow history, Logout, Guest banner (demo Admin).
- **Book detail**: Overview, Video, Summary, Reviews (form + list), Similar books, Borrow / Notify me / Wishlist / Share, Receipt page (in-app print view).

### 1.2 Còn thiếu / chưa hoàn thiện
| Khu vực | Thiếu | Ghi chú |
|--------|--------|--------|
| **Library** | Pagination | Danh sách “All books” load hết một lần |
| **Library** | Sort (mới nhất, phổ biến, A–Z) | Chỉ có filter genre + search |
| **Library** | Empty / no results state đẹp | Hiện chỉ text đơn giản |
| **Book detail** | Download receipt PDF | Chỉ có trang in trong app |
| **My Profile** | Download receipt từ profile | Chưa có link/button tới receipt |
| **My Profile** | Due date / countdown rõ ràng | Có trong data nhưng UI chưa nổi bật |
| **Global** | Notifications / reminders | Chưa có borrow reminder (email/workflow) |
| **Global** | Reading list / “Continue reading” | Chưa có khái niệm tiến độ đọc |

---

## 2. Giao diện đẹp mắt & hiện đại

### 2.1 Home (Dashboard)
- **Hero**: Gradient hoặc hình nền nhẹ phía sau “Welcome back”, typography rõ (Bebas Neue đã ổn, có thể thêm subtitle kiểu “Your library at a glance” với animation fade-in).
- **Stats cards**: Glassmorphism nhẹ (backdrop-blur, border mờ), hover scale nhẹ; icon + số lớn, label nhỏ.
- **Shortcuts**: Nút có icon + label, hover/active state rõ, có thể thêm subtle shadow.
- **Sections (Borrowed / New / Popular)**:
  - Section header có line hoặc accent màu bên cạnh tiêu đề.
  - Card grid nhất quán (gap, max-width), skeleton khi loading.
- **Empty states**: Illustration + CTA (e.g. “Browse Library”) thay vì chỉ chữ.

### 2.2 Library
- **Search bar**: Rounded, có icon search bên trái; focus ring đồng bộ theme; optional: search suggestions / recent searches (localStorage).
- **Genre pills**: Active state rõ (primary fill), inactive dạng outline hoặc muted; có thể scroll ngang trên mobile.
- **Sort**: Dropdown hoặc tabs (Newest / Popular / A–Z) cạnh search.
- **Book grid**: Card đồng nhất, hover lift + shadow; skeleton cho từng card khi load.
- **Pagination**: Numbered hoặc “Load more” với animation; không cần reload full page (soft nav).
- **No results**: Illustration + “Try different keywords or genres” + nút clear filters.

### 2.3 Wishlist
- **Header**: Số lượng wishlist (e.g. “12 books”) cạnh tiêu đề.
- **Empty state**: Illustration + “Discover books” CTA → Library.
- **List**: Cùng style với Library (card grid), có thể thêm “Move to top” / “Remove” nhanh.

### 2.4 My Profile
- **Layout**: Có thể tách thành sidebar nhỏ (Borrowed / History / Account) trên desktop.
- **Borrowed**: Mỗi item có due date nổi bật (badge “Due in 3 days”, màu warning); nút “Download receipt” rõ ràng → `/books/[id]/receipt?recordId=...`.
- **Borrow history**: Dạng timeline hoặc table nhỏ (ngày mượn / trả, tên sách); có thể collapse “Show more”.
- **Account**: Block logout tách biệt; guest banner nổi bật nhưng không chiếm quá nhiều không gian.

### 2.5 Book detail
- **Breadcrumb**: Đã có (Library / genre / title), có thể thêm chevron và hover.
- **Overview**: Cover lớn, thông tin (author, genre, rating) có icon; nút Borrow / Notify me / Wishlist / Share có state loading rõ.
- **Tabs hoặc sections**: Video / Summary / Reviews / Similar – có thể dùng tabs trên mobile để tiết kiệm scroll.
- **Reviews**: Avatar (initials), rating stars, date; form review có character count và validation message đẹp.
- **Similar**: Horizontal scroll trên mobile, grid trên desktop.

### 2.6 Global / Layout
- **Header**: Giữ bottom nav; có thể thêm subtle blur khi scroll.
- **Footer**: Đã có (fixed bottom, tech stack + backend).
- **Loading**: Progress bar hoặc skeleton đồng nhất (đã có loading.tsx).
- **Toasts**: Thông báo thành công/lỗi (e.g. thêm wishlist, borrow, return) dùng Radix Toast đã có.

---

## 3. Tính năng mới (nâng cao trải nghiệm)

### 3.1 Ưu tiên cao (impact lớn, phù hợp demo)
1. **Library – Pagination + Sort**
   - Phân trang (10–20 sách/trang) hoặc “Load more”.
   - Sort: Newest, Most borrowed, Title A–Z (URL params: `?sort=newest|popular|title`).

2. **My Profile – Due date nổi bật + Receipt**
   - Mỗi borrowed card: badge “Due in X days” (màu warning khi &lt; 7 ngày).
   - Nút “Download receipt” → trang receipt có nút “Print” / “Save as PDF” (browser print).

3. **Empty & loading states đẹp**
   - Empty: Illustration (SVG) + CTA (Library, Clear filters).
   - Loading: Skeleton cards thay vì spinner toàn màn hình.

4. **Book detail – Cải thiện nhỏ**
   - Link “Download receipt” trong overview (nếu đang mượn sách đó) → `/books/[id]/receipt?recordId=...`.
   - Share: prefill text (title + link) hoặc Web Share API trên mobile.

### 3.2 Ưu tiên trung bình
5. **Library – Lưu filter/sort trong URL**
   - Đã có search + genre; thêm sort → shareable link, back/forward đúng state.

6. **Wishlist – Số lượng trên nav**
   - Badge số wishlist trên icon (giống due soon); click → Wishlist.

7. **Home – “Due soon” block**
   - Section nhỏ “Return soon” với 1–3 sách sắp đến hạn, link “View all” → My Profile.

8. **Reviews – Số sao trung bình**
   - Trên book detail: hiển thị average rating + count từ `reviews` table (nếu chưa có).

### 3.3 Ưu tiên thấp / sau này
9. **Borrow reminder** ✅
   - Đã có: `GET /api/cron/borrow-reminder` (Vercel Cron 9h hàng ngày). Dùng `RESEND_TOKEN` (đã có trong project). Tùy chọn: `CRON_SECRET`, `RESEND_FROM_EMAIL`.

10. **Download receipt PDF**
    - Server-side PDF (e.g. react-pdf, Puppeteer) và download file thật.

11. **Reading list / Progress (nâng cao)**
    - Cho phép user đánh dấu “Reading” và optional “Progress %” (cần schema mới).

12. **Recommendations**
    - “Because you borrowed X” dựa trên genre/author (đơn giản từ DB).

---

## 4. Thứ tự triển khai gợi ý

| Phase | Nội dung | Lý do |
|-------|----------|--------|
| **Phase A** | Library pagination + sort, Empty/Loading states (Library, Wishlist, Profile) | Thiếu cơ bản, dễ demo |
| **Phase B** | My Profile: due date badge + receipt link, Book detail: receipt link khi đang mượn | Hoàn thiện luồng mượn/trả |
| **Phase C** | UI polish (glassmorphism, section accents, illustrations empty state) | Giao diện đẹp, hiện đại |
| **Phase D** | Wishlist count badge, Due soon block trên Home, Average rating từ reviews | Trải nghiệm mượt hơn |
| **Phase E** | Borrow reminder email, PDF download, Reading progress (optional) | Nâng cao, có thời gian thì làm |

---

## 5. File / component cần chỉnh hoặc thêm (tham khảo)

- **Library**: `app/(root)/library/page.tsx`, `components/LibrarySearch.tsx`, `components/BookList.tsx` – thêm sort, pagination, skeleton.
- **Empty states**: Component chung `components/EmptyState.tsx` (illustration + message + CTA).
- **My Profile**: `app/(root)/my-profile/page.tsx`, `components/BookCard.tsx` (cho borrowed) – due badge, receipt link.
- **Book detail**: `components/BookOverview.tsx` – link receipt khi có borrow record.
- **Constants**: Thêm sort options, page size cho Library.
- **Actions**: `lib/actions/book.ts` – hàm list books có sort + offset/limit cho pagination.

---

## 6. Tóm tắt một dòng

- **Thiếu**: Pagination & sort Library, due date & receipt rõ trên Profile, empty/loading states đẹp, link receipt từ book detail.
- **Giao diện**: Glassmorphism nhẹ, section accents, illustrations cho empty, skeleton loading, nút và badge rõ ràng.
- **Tính năng thêm**: Sort + pagination, receipt/print flow hoàn chỉnh, wishlist count badge, due soon block, sau đó reminder email & PDF nếu cần.

Bạn có thể dùng doc này để báo cáo tiến độ với interviewer (“đã làm Phase A, đang làm Phase B”) và thể hiện tư duy product + UX.
