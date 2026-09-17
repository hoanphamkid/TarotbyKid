# Mystic Tarot

Website Tarot tiếng Việt bằng React, Vite và Tailwind CSS. Hoạt động độc lập trên trình duyệt với 78 lá Rider-Waite-Smith, không cần database hay backend cho chế độ mặc định.

## Chạy trên máy

Cài Node.js 22.19 trở lên. Mở PowerShell tại thư mục dự án:

```powershell
cd D:\tarot
npm install
npm run dev
```

Mở địa chỉ mà Vite in ra, thường là http://localhost:5173. Nếu cổng bận, Vite chọn cổng kế tiếp.

```powershell
npm test
npm run test:ui
npm run build
npm run preview
```

`build` tạo thư mục `dist`. `preview` phục vụ bản build, thường tại http://localhost:4173. Dev server/preview trên máy cá nhân chỉ truy cập được khi máy và tiến trình còn chạy; bản đã deploy lên Vercel hoạt động độc lập với máy cá nhân.

## Tính năng

- 78 lá với tên Việt, ảnh cục bộ, từ khóa, nghĩa xuôi/ngược và ứng dụng riêng theo tình yêu, công việc, tài chính, lời khuyên.
- 13 chủ đề, câu hỏi tùy chọn tối đa 500 ký tự, ngữ cảnh tình cảm/công việc.
- 6 kiểu trải: một lá; quá khứ/hiện tại/tương lai; bạn/người ấy/mối quan hệ; tình huống/trở ngại/lời khuyên; năm lá; Yes/No.
- Xào Fisher-Yates toàn bộ 78 lá; hiển thị 24 lá úp để tự chọn, không trùng trong lượt; xuôi/ngược mặc định 50/50; lật bài lần lượt.
- Lời giải xác định theo dữ liệu, không random văn bản. Có phân tích nhóm chất, Major Arcana, tỷ lệ ngược, cặp lá, chiều lá, vị trí, chủ đề và ngữ cảnh. Câu hỏi có một số quy tắc từ khóa tiếng Việt; chế độ quy tắc không hiểu tự do như mô hình ngôn ngữ.
- Yes/No dùng điểm năng lượng riêng cho từng lá và từng chiều, trọng số vị trí cuối 1.5, các vị trí còn lại 1. Không phải xác suất tiên đoán.
- Tarot hôm nay lưu theo ngày địa phương của thiết bị; xem lại giữ nguyên lá trong ngày.
- Lịch sử tối đa 100 lượt, xem lại, xóa từng lượt hoặc toàn bộ; xóa lịch sử không xóa lá hôm nay.
- Thư viện tìm tên Việt không dấu, tên Anh, từ khóa; lọc bộ; trang chi tiết xuôi/ngược.
- Web Share API hoặc sao chép clipboard; ảnh dự phòng; điều hướng bàn phím; tôn trọng reduced motion; bố cục responsive.

## Các trang

`/`, `/reading`, `/love`, `/career`, `/finance`, `/daily`, `/cards`, `/cards/:slug`, `/history`.

Ví dụ `/cards/the-lovers` hoặc `/reading?spread=deep-5`.

## Push GitHub

1. Đăng nhập GitHub, tạo một repository trống, ví dụ `mystic-tarot`. Không thêm README trên GitHub vì dự án đã có sẵn.
2. Tại thư mục dự án, chạy:

```powershell
git init
git add .
git commit -m "Build Mystic Tarot website"
git branch -M main
git remote add origin https://github.com/TEN_CUA_BAN/mystic-tarot.git
git push -u origin main
```

Thay `TEN_CUA_BAN` bằng tài khoản GitHub của bạn. Nếu repository đã có remote, dùng remote hiện tại hoặc `git remote set-url origin ...`. Khi Git yêu cầu đăng nhập, hoàn tất đăng nhập GitHub. `.gitignore` loại `.env`, `node_modules`, `dist` và `.vercel`; không đưa API key vào Git.

## Deploy Vercel

1. Đăng nhập https://vercel.com bằng tài khoản GitHub.
2. Chọn **Add New → Project**, chọn repository vừa push, rồi **Import**.
3. Framework chọn **Vite**, Root Directory giữ thư mục gốc. Build Command: `npm run build`, Output Directory: `dist`, Install Command: `npm install`. Chọn Node.js 22.x hoặc bản mới hơn tương thích.
4. Chưa dùng AI thì không cần khai báo biến môi trường. Nhấn **Deploy**.
5. Mở URL `https://ten-project.vercel.app`. Thử mở trực tiếp và refresh `/love`, `/cards/the-lovers`, `/daily` để xác nhận routing.
6. Những lần sau, `git add .`, `git commit` và `git push` để Vercel build lại tự động.

`vercel.json` chuyển các đường dẫn giao diện về `index.html`; `/api/` và tài nguyên tĩnh được giữ riêng. Function `api/tarot-reading.js` được Vercel nhận diện tự động. Không cần VPS. Khi deploy xong, người khác vẫn vào được dù bạn tắt máy.

Chưa có tài khoản hay thông tin đăng nhập Vercel/GitHub trong phiên xây dựng này, nên dự án được chuẩn bị để deploy, không tự xuất bản lên tài khoản của bạn.

## Cấu trúc

```text
api/tarot-reading.js          Vercel Function cho AI tùy chọn
public/cards-images/         78 ảnh đã tối ưu
public/night-sky.jpg         Ảnh nền
scripts/                    Tải và tối ưu ảnh
src/components/             Header/footer, mặt bài, kết quả
src/data/tarotCards.js       78 lá và cấu trúc dữ liệu xuất ra
src/data/topicLenses.js      Ứng dụng riêng của mỗi lá theo chủ đề
src/data/options.js          Chủ đề, ngữ cảnh, kiểu trải
src/pages/                  Home, rút bài, thư viện, lịch sử
src/services/tarotEngine.js  Bộ quy tắc diễn giải
src/services/aiTarotService.js  Chọn AI hoặc fallback
src/utils/                  Xào bài và localStorage
src/styles/index.css        Giao diện và responsive
tests/                      Kiểm thử dữ liệu, engine, API và thao tác UI
```

## Chỉnh dữ liệu lá bài

`tarotCards.js` xuất mảng đầy đủ 78 đối tượng. Các hàng gốc được biên soạn riêng cho từng lá rồi chuẩn hóa thành `id`, `slug`, `name`, `vietnameseName`, `arcana`, `suit`, `number`, `image`, `keywords`, `upright`, `reversed`, `energy`.

Để sửa hoặc mở rộng dữ liệu: chỉnh hàng tương ứng trong `major`/`minor`, thêm ứng dụng cùng ID trong `topicLenses.js`, đặt ảnh tại `public/cards-images/<id>.jpg`. ID và slug phải duy nhất; cập nhật kiểm thử nếu chủ động thay đổi tổng số lá khỏi chuẩn 78. Các cột cuối là điểm năng lượng xuôi và ngược cho Yes/No, không phải xác suất.

Sửa `UPRIGHT_RATE` trong `src/utils/shuffle.js` để đổi tỷ lệ xuôi. Thêm kiểu trải tại `src/data/options.js` và chú giải vị trí trong `tarotEngine.js`.

## Bật AI tùy chọn

Mặc định AI tắt, câu hỏi không gửi lên server. Dịch vụ tùy chọn dùng nhà cung cấp có API Chat Completions tương thích, trả `choices[0].message.content`.

Trong **Vercel → Project → Settings → Environment Variables**, đặt:

```dotenv
VITE_AI_ENABLED=true
AI_ENABLED=true
AI_API_KEY=key-cua-ban
AI_API_URL=https://DIA_CHI_NHA_CUNG_CAP/v1/chat/completions
AI_MODEL=ten-model-ho-tro
```

Sau đó redeploy vì `VITE_AI_ENABLED` được đưa vào frontend lúc build. `AI_API_KEY` chỉ dùng trong Vercel Function; tuyệt đối không đặt tên `VITE_AI_API_KEY`. Frontend chỉ gửi tới `/api/tarot-reading`, không gọi nhà cung cấp trực tiếp. Function kiểm tra dữ liệu, tự lấy nghĩa chuẩn của các lá và gửi cùng system prompt. Nếu timeout, cấu hình thiếu hoặc nhà cung cấp lỗi, frontend vẫn hiển thị lời giải quy tắc.

Để thử function trên máy, dùng Vercel CLI `npx vercel dev` và khai báo biến môi trường trong `.env`; `npm run dev` chỉ chạy Vite, nên AI sẽ fallback nếu chưa chạy function. Giới hạn chi phí và bảo vệ endpoint bằng các thiết lập của nhà cung cấp/Vercel trước khi bật AI công khai. Bản này không có đăng nhập hoặc hạn mức theo người dùng.

## Lưu trữ và quyền riêng tư

`tarotHistory` chứa các lượt xem; `dailyTarot_YYYY-MM-DD` giữ lá mỗi ngày. LocalStorage chỉ thuộc trình duyệt/origin hiện tại, không đồng bộ thiết bị và có thể mất khi xóa dữ liệu trình duyệt. Đổi ngày thiết bị hoặc xóa localStorage có thể bỏ giới hạn ngày; đây không phải cơ chế chống gian lận trên server. Nếu trình duyệt chặn lưu trữ hoặc hết dung lượng, kết quả vẫn hiển thị và báo không lưu được.

Ảnh bài và nền được phục vụ từ dự án. Font tải từ Google Fonts, có font hệ thống dự phòng. Khi AI bật, giao diện thông báo rằng câu hỏi/ngữ cảnh/lá bài được gửi tới dịch vụ AI.

## Nguồn hình ảnh

- Hình Rider-Waite-Smith do Pamela Colman Smith minh họa, nguồn bộ ảnh: https://github.com/sixseeds/tarot-api (nguồn ghi public domain). Giữ thông tin nguồn khi phân phối lại.
- Nền không gian: https://unsplash.com/photos/1462331940025-496dfbfc7564 (ảnh qua images.unsplash.com/photo-1462331940025-496dfbfc7564).
- Toàn bộ lời giải tiếng Việt trong dự án là nội dung biên soạn, không sao chép một sách hướng dẫn thương mại.

Chạy `node scripts/download-assets.mjs` rồi `node scripts/optimize-assets.mjs` nếu cần tải lại ảnh. Ảnh đã có sẵn nên không cần bước này để chạy hoặc deploy.
