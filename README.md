# TH_APP_Final

Bài thực hành 5 - Ứng dụng chat 1-1 realtime với Firebase.

React Native CLI, TypeScript, Firebase Authentication + Realtime Database.

## Tính năng

- Đăng ký, đăng nhập, đăng xuất bằng Firebase Authentication
- Danh bạ người dùng, hiển thị online/offline realtime, có tìm kiếm
- Chat 1-1 realtime, tin của mình bên phải, tin người kia bên trái
- Gửi vị trí GPS dưới dạng bong bóng kèm link Google Maps
- Màn hình Home hiển thị tin nhắn cuối và số tin chưa đọc
- Màn hình Thông báo và Cài đặt

## Cài đặt

```
npm install
npm start
npm run android
```

Trước khi chạy, dán cấu hình Firebase vào `src/services/firebaseConfig.ts` và
publish rules trong `firebase-rules.json` lên Realtime Database.

Xem chi tiết trong `HUONG_DAN.md`.
