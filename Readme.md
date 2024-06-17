### 0/ Cài đặt nodejs vào máy

- https://nodejs.org/en/download/package-manager

### 1/ Cài đặt
- Tại thư mục dự án, chạy lệnh sau để cài đặt thư viện

- `npm install`

### 2/ Copy file `.env.example` thành file `.env` và cung cấp thông tin cần thiết vào file `env`

### 3/ Chạy script

#### 3.1/ Approve token

- `node approve.js`


#### 3.2/ Send token
- `node transferErc20.js`


#### 3.3/ Theo dõi, gửi token ngay sau khi nhận được token

- `node monitorAndSendTokens.js`
