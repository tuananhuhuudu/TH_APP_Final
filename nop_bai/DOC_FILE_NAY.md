# Sản phẩm nộp bài - Bài thực hành 5

Chat 1-1 realtime với Firebase. React Native CLI + TypeScript.
Ảnh và video đều chụp từ app chạy thật trên 2 máy ảo Android.

## Nộp những gì

- `MA_NGUON_TH_APP_FINAL.zip` - mã nguồn, đã bỏ node_modules, build, Pods
- `1_dang_ky.png` - màn Đăng ký, 4 ô, mật khẩu tối thiểu 6 ký tự
- `2_home_co_so_chua_doc.png` - Home có badge "3 chưa đọc"
- `3_danh_ba_online.png` - Danh bạ, "1 đang online", chấm xanh
- `4_chat_may_An.png` - Chat có tin thường và tin vị trí
- `8_firebase_console.png` - Firebase Console tab Data, thấy dữ liệu tin nhắn
- `video_may_An.mp4` + `video_may_Binh.mp4` - quay đồng thời 2 máy, 75 giây

Nộp thêm cho đẹp: `5_chat_may_Binh.png`, cùng cuộc trò chuyện nhưng nhìn từ máy kia,
trái phải đảo ngược. Ghép với ảnh 4 là thấy ngay tin của mình luôn nằm bên phải.

Mấy ảnh còn lại (`0_dang_nhap`, `6_thong_bao`, `7_cai_dat`) không bắt buộc.

## Video

Hai video quay cùng lúc trên 2 máy. Nội dung: 4 tin nhắn qua lại + 1 tin vị trí.
Mở song song sẽ thấy tin hiện gần như tức thì ở cả hai bên.

Nếu cần gộp thành 1 file:

```
ffmpeg -i video_may_An.mp4 -i video_may_Binh.mp4 -filter_complex hstack=inputs=2 video_2_may.mp4
```

Hoặc mở 2 cửa sổ máy ảo cạnh nhau rồi quay màn hình máy tính bằng Win+G. Cách này
trực quan hơn vì thấy cả hai máy trong một khung.

## Tài khoản test

- `an@test.com` / `123456` - Nguyen Van An
- `binh@test.com` / `123456` - Tran Thi Binh

## Dữ liệu trên Firebase

File `firebase_data.txt` là toàn bộ 3 nhánh `users`, `chats`, `messages` xuất từ
Realtime Database. Dùng khi cần dán dữ liệu vào báo cáo.

Trong database hiện có 2 tài khoản, 13 tin nhắn, trong đó 2 tin kiểu `location`
có kèm `latitude` và `longitude`.

`chatId` là hai uid sắp xếp theo alphabet rồi nối bằng dấu gạch dưới. Phải sắp xếp
thì A mở chat với B và B mở chat với A mới ra cùng một id, không tạo 2 hội thoại riêng.
