# Feature Analysis - Library Management System

## Danh sách Features từ README

| # | Feature | Trạng thái | Ghi chú |
|---|---------|------------|---------|
| 1 | **Open-source Authentication** | ✅ Done | Sign up, sign in, onboarding workflow |
| 2 | **Home Page** - Highlighted books, 3D effects | ✅ Done | BookOverview, BookList |
| 3 | **Library Page** - Filtering, search, pagination | ❌ Chưa | Chỉ list tất cả sách, không có search/filter/pagination |
| 4 | **Book Detail** - Similar books suggestions | ❌ Chưa | Có comment `{/* SIMILAR */}` - chưa implement |
| 5 | **Profile Page** - Track borrowed, download receipts | ⚠️ Một phần | Track borrowed ✅, Download receipt = button only, chưa có PDF |
| 6 | **Onboarding Workflows** | ✅ Done | Welcome email, follow-ups |
| 7 | **Borrow Book Reminder** - Email trước/sau due date | ❌ Chưa | Không có workflow gửi email nhắc trả sách |
| 8 | **Borrow Book Receipt** - PDF receipt | ❌ Chưa | Button "Download receipt" không có chức năng |
| 9 | **Analytics Dashboard** | ❌ Chưa | Admin page chỉ hiển thị "Admin Dashboard" |
| 10 | **All Users Page** | ❌ Chưa | Không có `/admin/users` |
| 11 | **Account Requests Page** | ❌ Chưa | Không có `/admin/account-requests` |
| 12 | **All Books Page** - Search, pagination, filters | ⚠️ Một phần | Page có, nhưng chỉ "Table" placeholder |
| 13 | **Book Management Forms** - Add/Edit | ⚠️ Một phần | Add new ✅, Edit chưa |
| 14 | **Book Details Page (Admin)** | ❌ Chưa | Không có `/admin/books/[id]` |
| 15 | **Borrow Records Page** | ❌ Chưa | Không có `/admin/borrow-records` |
| 16 | **Role Management** | ❌ Chưa | Không có UI đổi role user |
| 17 | **Advanced** - Rate-limiting, caching | ⚠️ Một phần | Rate-limiting ✅, Caching chưa rõ |

## Implementation Plan

### Phase 1: User-facing (ưu tiên cao) ✅
1. **Library** - Search + filter by genre ✅ DONE
2. **Book Detail** - Similar books (cùng genre) ✅ DONE
3. **Download Receipt** - PDF generation (phức tạp, để phase sau)

### Phase 2: Admin core (ưu tiên cao) ✅
4. **Admin Dashboard** - Thống kê (users, books, borrows) ✅ DONE
5. **Admin All Books** - Table thật với data từ DB ✅ DONE
6. **Admin All Users** - List users ✅ DONE
7. **Admin Account Requests** - Pending users list ✅ DONE
8. **Admin Borrow Records** - Lịch sử mượn sách ✅ DONE

### Phase 3: Bổ sung (ưu tiên trung bình)
9. Library pagination
10. Admin Book Details page
11. Edit book form
12. Role Management UI
13. Approve/Reject user (Account Requests)

### Phase 4: Nâng cao (ưu tiên thấp)
14. Borrow Book Reminder workflow
15. Download Receipt PDF
16. Caching với Redis
