# Phân tích trang Book & Đề xuất tính năng

## 1. Tính năng chưa phát triển / chỉ là UI

| Tính năng | Hiện trạng | Ghi chú |
|-----------|------------|--------|
| **Download receipt** | Nút "Download receipt" có trên BookCard (sách đang mượn) nhưng **không có xử lý** – không tải file, không tạo PDF. | Nút nằm trong `Link` tới `/books/[id]`, click chỉ mở trang sách. |
| **Return book (trả sách)** | User **không thể tự trả sách** trong app. Chỉ admin xem borrow records; không có flow "Tôi đã trả sách" từ phía user. | Cần action trả sách (user request return) và/hoặc admin confirm return. |
| **Rating / Review** | Rating chỉ **hiển thị** (số + icon sao), không có đánh giá từ user, không có review/chấm sao. | Schema `books.rating` là integer cố định, không có bảng reviews. |
| **Notify when available** | Khi sách hết (availableCopies = 0) chỉ hiện "Total / Available"; **không có** "Thông báo khi có sách". | Cần bảng waitlist + email/notification (hoặc in-app) khi có bản trả. |

---

## 2. Trang Book hiện có gì

- **Trang chi tiết sách** (`/books/[id]`): Overview (title, author, genre, rating, total/available copies, description), nút Borrow, Video, Summary, Similar books (cùng genre).
- **Library**: Tìm theo title/author, lọc genre, danh sách thẻ sách.
- **My Profile**: Danh sách sách đang mượn, due date, days left, nút Download receipt (chưa hoạt động).
- **Borrow**: Có server action, đã chặn guest, có dialog cảnh báo.

---

## 3. Đề xuất tính năng mới (sinh động & thiết thực)

### Ưu tiên cao (thiết thực với mượn/trả)

1. **Download receipt (phiếu mượn sách)**  
   - Tạo PDF hoặc trang in với: tên sách, user, ngày mượn, hạn trả, mã borrow.  
   - Trên BookCard (sách đang mượn) và/hoặc My Profile: nút "Download receipt" → tải file hoặc mở trang print.

2. **Yêu cầu trả sách / Return book**  
   - Trên My Profile hoặc trang sách (khi đang mượn): nút "Request return" hoặc "I've returned this book".  
   - Backend: cập nhật borrow record (status RETURNED, returnDate), tăng lại `availableCopies`.  
   - (Tùy quy trình: user tự đánh dấu trả, hoặc admin xác nhận sau khi nhận sách.)

3. **Notify when available**  
   - Khi sách hết: nút "Notify me when available".  
   - Lưu email/userId + bookId (waitlist).  
   - Khi có bản trả (hoặc admin thêm bản): gửi email hoặc hiện thông báo trong app (nếu có notification).

### Ưu tiên trung bình (trải nghiệm tốt hơn)

4. **Wishlist / Favorites**  
   - User lưu "Sách muốn đọc" (heart icon trên card hoặc trang sách).  
   - Trang "My wishlist" hoặc section trong My Profile.  
   - Cần bảng `wishlists(userId, bookId)` hoặc tương đương.

5. **Rating & Review từ user**  
   - Cho phép user đánh giá (1–5 sao) và viết review ngắn sau khi mượn/đọc.  
   - Cần bảng `reviews(userId, bookId, rating, comment, createdAt)`.  
   - Trang sách: hiển thị rating trung bình + danh sách review.

6. **Lịch sử mượn**  
   - Trong My Profile: tab/section "Borrow history" – danh sách đã mượn (đã trả), ngày mượn/trả.  
   - Giúp user nhớ đã đọc gì, dễ gợi ý "Similar books" hoặc "You might also like".

### Ưu tiên thấp (sinh động, engagement)

7. **Chia sẻ sách**  
   - Nút "Share" trên trang sách: copy link hoặc share qua Web Share API (mobile).  
   - Text mẫu: "Xem cuốn [title] trên BookWise: [url]".

8. **Sách nổi bật / Trending**  
   - Trang chủ hoặc Library: section "Popular this week" – sách được mượn nhiều (đếm từ borrow_records).  
   - Hoặc "New arrivals" (sách mới thêm – đã có `createdAt`).

9. **Badge / trạng thái trực quan**  
   - Trên BookCard: "Hết sách", "Còn X bản", "Mới", "Đang mượn bởi bạn".  
   - Giúp scan nhanh khi lướt thư viện.

10. **Breadcrumb & SEO**  
    - Trang sách: breadcrumb Library > [Genre] > [Title].  
    - Meta title/description cho từng sách (trích description) – tốt cho share và SEO.

---

## 4. Thứ tự triển khai gợi ý

1. **Download receipt** – nhu cầu rõ, dùng ngay (in/tải phiếu mượn).  
2. **Return book** – hoàn thiện vòng đời mượn/trả, giảm thủ công cho admin.  
3. **Notify when available** – tăng engagement khi sách hết.  
4. **Wishlist** – ít thay đổi schema, tăng tương tác.  
5. **Rating/Review** – cần schema mới, làm sau khi core ổn định.

---

## 5. Tóm tắt

- **Chưa làm thật:** Download receipt, Return book, Rating từ user, Notify when available.  
- **Nên làm trước:** Receipt, Return book, Notify when available.  
- **Làm thêm để sinh động:** Wishlist, Rating/Review, Borrow history, Share, Trending/New, Badge, Breadcrumb/SEO.

File này có thể dùng làm backlog cho sprint Book features.
