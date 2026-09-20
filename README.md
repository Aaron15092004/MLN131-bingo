# Bingo Pháp Quyền — màn hình host

1. Cài đặt: `npm install` (font đã đóng gói sẵn, cài xong dùng được hoàn toàn offline).
2. Chạy: `npm run dev` rồi mở địa chỉ in ra; hoặc `npm run build && npm run preview` để chạy bản build. Bấm `F` để toàn màn hình.
3. Bảng số 1–25: bấm vào ô, hoặc gõ số rồi `Enter`, để mở câu hỏi. Chọn phương án bằng cách bấm vào nó hoặc nhấn `A`–`D`: đúng thì số được khoanh; sai thì giữ lại số và không hiện đáp án đúng.
4. Phím tắt: `Esc` về bảng số, `T` tạm dừng/tiếp tục đồng hồ, `F` toàn màn hình. Nút "Đặt lại" (có xác nhận) xóa các số đã khoanh.
5. Sửa `src/data/questions.json` (`id`, `q`, `options`, `answer` là chữ cái `A`–`D`, `explain`); các số đã khoanh được lưu trong trình duyệt.
