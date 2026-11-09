# Bài thực hành 5 - Chat 1-1 realtime với Firebase

React Native CLI, TypeScript, Firebase Authentication + Realtime Database.

## Tạo project Firebase

Vào console.firebase.google.com, Add project, đặt tên, tắt Analytics cho nhanh.

Bật Authentication: menu trái chọn Build > Authentication > Get started, tab
Sign-in method, chọn Email/Password, bật Enable, Save.

Bật Realtime Database: Build > Realtime Database > Create Database. Chọn location
Singapore, Start in locked mode, Enable.

Lưu ý dễ bấm nhầm: phải là Realtime Database, không phải Firestore Database. Hai
cái nằm cạnh nhau trong menu.

Dán rules: vẫn ở Realtime Database, tab Rules, xoá hết, dán nội dung file
`firebase-rules.json`, bấm Publish. Dán không thôi chưa có tác dụng, phải bấm nút
lưu (tuỳ bản mà nó tên Publish hay Save).

Lấy config: bánh răng góc trên trái > Project settings > kéo xuống Your apps > bấm
icon `</>` > đặt nickname > Register app. Copy khối firebaseConfig.

Dán config vào `src/services/firebaseConfig.ts`. Nếu config không có dòng
`databaseURL` thì lấy ở tab Realtime Database, dạng
`https://<project-id>-default-rtdb.asia-southeast1.firebasedatabase.app`.

## Chạy app

```
npm install
npm start
npm run android
```

Build lần đầu khá lâu vì gộp cả 4 kiến trúc CPU. Muốn nhanh hơn, chỉ build cho
máy ảo:

```
cd android
./gradlew assembleDebug -PreactNativeArchitectures=x86_64
```

APK giảm từ 157 MB xuống 48 MB, cài cũng nhanh hơn nhiều.

## Chạy 2 máy ảo

```
emulator -list-avds
emulator -avd <ten_may_1>
emulator -avd <ten_may_2>
adb devices
npx react-native run-android --deviceId emulator-5554
npx react-native run-android --deviceId emulator-5556
```

Đăng ký 2 tài khoản khác nhau trên 2 máy rồi nhắn tin qua lại.

## Cấu trúc dữ liệu

```
users/{uid}
  uid, fullName, email
  online          true/false, cập nhật realtime bằng onDisconnect
  lastSeen, createdAt

chats/{chatId}
  members/{uid}: true
  lastMessage, lastMessageAt, lastSenderId
  unread/{uid}: số tin chưa đọc

messages/{chatId}/{messageId}
  senderId, type, text, createdAt
  latitude, longitude     chỉ có khi type = location
```

`chatId` = hai uid sắp xếp alphabet rồi nối bằng `_`. Không sắp xếp thì A mở chat
với B ra `A_B`, B mở với A ra `B_A`, thành hai hội thoại khác nhau.

## Cấu trúc thư mục

```
src/
  services/              toàn bộ code Firebase gom ở đây
    firebase.ts            khởi tạo app, auth, database
    firebaseConfig.ts      chỗ dán config
    authService.ts         đăng ký, đăng nhập, đăng xuất, dịch mã lỗi
    userService.ts         danh bạ
    chatService.ts         gửi nhận tin, tóm tắt hội thoại, đếm chưa đọc
    presenceService.ts     online/offline
    locationService.ts     xin quyền, lấy GPS
  screens/               auth, home, contacts, chat, notifications, settings
  navigation/            RootNavigator, AuthStack, MainTabs, types
  components/            Avatar, AppButton, FormInput, MessageBubble,
                         MessageInput, SearchBar, EmptyState
  context/               AuthContext
  hooks/                 useUnreadTotal
  utils/                 format, validators
  theme/                 màu, khoảng cách, bo góc
  types/                 kiểu dữ liệu dùng chung
```

## Các yêu cầu của đề nằm ở đâu

- Đăng ký có xác nhận mật khẩu, tối thiểu 6 ký tự: `utils/validators.ts`
- Báo lỗi sai tài khoản/mật khẩu: `authService.ts`, hàm `mapAuthError`
- Đăng xuất về màn Đăng nhập: `RootNavigator` đổi cây màn hình khi user = null
- Danh bạ không gồm bản thân: `userService.ts`, `subscribeUsers` lọc theo uid
- Online/offline realtime: `presenceService.ts`, dùng `.info/connected` + `onDisconnect`
- Tìm kiếm danh bạ: `ContactsScreen`, lọc bằng useMemo theo tên và email
- Tin mình bên phải, người kia bên trái: `MessageBubble`, prop `isMine`
- Mỗi tin có thời gian: `MessageBubble`, hàm `formatTime`
- Không gửi tin rỗng: chặn ở `MessageInput` và chặn lại trong `sendMessage`
- Tự cuộn xuống tin mới: `ChatScreen`, `scrollToEnd` + `onContentSizeChange`
- Tiêu đề hiện tên và trạng thái: `ChatScreen`, `navigation.setOptions` + `subscribeUser`
- Hội thoại mới nhất lên đầu: `subscribeChats` sắp theo `lastMessageAt` giảm dần
- Số chưa đọc tăng ngay: `increment()` khi gửi, `markChatAsRead()` khi mở
- Hủy lắng nghe trong cleanup: mọi useEffect có listener đều return unsubscribe
- Gửi vị trí: `locationService.ts` và nút trong `MessageInput`

## Lỗi hay gặp

App hiện cảnh báo vàng chưa cấu hình Firebase: chưa dán config vào `firebaseConfig.ts`.

`auth/invalid-api-key`: apiKey sai hoặc còn placeholder.

`auth/operation-not-allowed`: chưa bật Email/Password trong Authentication.

Đăng nhập được nhưng danh bạ trống: chưa publish rules, hoặc chưa đăng ký tài
khoản thứ hai.

`permission_denied at /users`: rules chưa publish, hoặc dán nhầm vào Firestore.

Tin nhắn hiện 2 lần: thiếu return unsubscribe trong useEffect.

`Could not connect to development server`: Metro chưa chạy, hoặc cần
`adb reverse tcp:8081 tcp:8081`.

`Unable to load script`: mở app lúc Metro chưa bundle xong, đợi Metro báo xong rồi
mở lại app.

Cài APK báo `Broken pipe`: APK quá to, build lại chỉ cho x86_64 như ở trên.

Máy ảo hiện "System UI isn't responding": máy quá tải, bấm Wait rồi đợi vài giây.
Chạy 2 máy ảo cùng lúc thì nên cấp thêm RAM: `emulator -avd <ten> -memory 4096`.

Không lấy được vị trí trên máy ảo: máy ảo không có GPS thật. Mở Extended controls
(dấu ba chấm cạnh máy ảo) > tab Location > nhập toạ độ > Set location, rồi mới bấm
nút gửi vị trí trong app.
