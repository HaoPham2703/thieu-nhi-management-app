# 📘 Thiếu Nhi Management App

Ứng dụng quản lý thiếu nhi trong giáo xứ / nhà thờ

Giúp Giáo lý viên (GLV), Ban Giáo Lý, và Cha xứ dễ dàng quản lý các lớp học, học sinh, điểm danh và thống kê.

## 🌟 Tính năng chính

### 👩‍🏫 Dành cho Giáo Lý Viên (GLV)

- Xem danh sách lớp phụ trách
- Cập nhật thông tin học sinh
- Điểm danh mỗi buổi học
- Ghi chú chuyên cần, hạnh kiểm

### 👨‍👧 Dành cho Ban Giáo Lý / Admin

- Quản lý toàn bộ danh sách lớp, học sinh, GLV
- Phân công giáo lý viên cho từng lớp
- Thống kê chuyên cần, tỷ lệ nghỉ học
- Quản lý thông tin năm học, giai đoạn, khóa học

### ⛪ Dành cho Cha xứ / Giám sát

- Xem báo cáo tổng quan
- Theo dõi tiến trình học tập và chuyên cần của thiếu nhi

## 🧩 Kiến trúc hệ thống

Ứng dụng được xây dựng theo mô hình 3 lớp (Three-layer architecture):

**Presentation → Business Logic → Data Access**

- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: RESTful JSON

## 📈 Trạng thái dự án

### Hoàn thành

- [x] Khung ứng dụng Frontend (Expo Router, UI cơ bản)
- [x] Danh sách nhà thờ, phân nhóm theo khu vực, hiệu ứng animation
- [x] Mở Google Maps (xem bản đồ, chỉ đường) trên iOS/Android/Web
- [x] Cấu trúc dữ liệu tách riêng (`constants/churches.ts`, `utils/churches.ts`)
- [x] README, .gitignore, cấu trúc FE/BE

### Đang thực hiện

- [ ] Thiết kế API Backend (Express + Prisma)
- [ ] Xác thực người dùng (JWT)
- [ ] Đồng bộ dữ liệu thật từ Backend vào app

### Kế hoạch sắp tới

- [ ] Bộ lọc, tìm kiếm nhà thờ theo khu vực/tên
- [ ] Đồng bộ/offline-first cơ bản
- [ ] CI lint/format và release scripts

## 🗂️ Cấu trúc thư mục

### 📱 Frontend (React Native - Expo)

```
my-first-app/
├── app/                        # File-based routing
│   ├── (tabs)/                 # Tab navigation
│   │   ├── index.tsx          # Trang chủ (Quản lý thiếu nhi)
│   │   ├── explore.tsx        # Khám phá
│   │   └── _layout.tsx        # Tab layout
│   ├── modal.tsx              # Modal screens
│   └── _layout.tsx            # Root layout
├── constants/
│   ├── churches.ts            # Data nhà thờ
│   └── theme.ts               # Theme colors & fonts
├── utils/
│   └── churches.ts            # Helper functions
├── components/                # Reusable components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── haptic-tab.tsx
│   └── ui/
│       ├── collapsible.tsx
│       └── icon-symbol.tsx
├── hooks/                      # Custom hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── assets/                     # Static assets
│   └── images/
├── app.json                    # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

### 🔧 Backend (Node.js + Express)

```
thieu-nhi-management-app-backend/
├── src/
│   ├── controllers/           # Xử lý request/response
│   │   ├── studentController.js
│   │   ├── classController.js
│   │   └── attendanceController.js
│   ├── services/              # Business logic
│   │   ├── studentService.js
│   │   └── attendanceService.js
│   ├── repositories/          # Data access layer
│   │   ├── studentRepository.js
│   │   └── classRepository.js
│   ├── routes/                # API endpoints
│   │   ├── studentRoutes.js
│   │   ├── classRoutes.js
│   │   └── index.js
│   ├── middleware/            # Auth, validation
│   │   ├── auth.js
│   │   └── validator.js
│   ├── db/                    # Database config
│   ├── app.js
│   └── server.js
├── prisma/
│   └── schema.prisma          # Database schema
├── .env
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Cài đặt & Chạy dự án

### 🪄 1. Clone dự án

```bash
git clone https://github.com/HaoPham2703/thieu-nhi-management-app.git
cd thieu-nhi-management-app
```

### 🧱 2. Cài đặt dependencies

```bash
npm install
```

### 🛠️ 3. Cấu hình môi trường

Tạo file `.env` (copy từ `.env.example`):

```
DATABASE_URL="postgresql://username:password@localhost:5432/thieunhi"
PORT=4000
```

### 🚀 4. Chạy dự án

```bash
npm run dev
```

hoặc

```bash
npx nodemon src/server.js
```

## 💾 Database

### Mô hình dữ liệu chính:

| Bảng         | Mô tả                  |
| ------------ | ---------------------- |
| `students`   | Danh sách thiếu nhi    |
| `classes`    | Thông tin lớp học      |
| `teachers`   | Giáo lý viên phụ trách |
| `attendance` | Điểm danh, chuyên cần  |
| `users`      | Tài khoản đăng nhập    |
| `roles`      | Phân quyền hệ thống    |

### ERD

![ERD_my_church](./ERD_my_church.png)

[Xem ERD trên dbdiagram.io](https://dbdiagram.io/d/ERD_my_church-674aeddbe9daa85aca34d1fd)

## 🧑‍💻 Công nghệ sử dụng

| Thành phần | Công nghệ             |
| ---------- | --------------------- |
| Frontend   | React Native (Expo)   |
| Backend    | Node.js + Express     |
| Database   | PostgreSQL            |
| ORM        | Prisma                |
| Auth       | JWT                   |
| API        | RESTful JSON          |
| Dev Tools  | Git, VS Code, Postman |

## 🔐 Mục tiêu phát triển

- [x] Đăng nhập phân quyền GLV / Admin
- [x] Quản lý lớp học và học sinh
- [x] Điểm danh theo buổi học
- [ ] Xuất thống kê và báo cáo tổng hợp
- [ ] Tích hợp Firebase Push Notification

## 👥 Thành viên phát triển

- **Phạm Hào** — Developer / Designer
- Nhóm GLV hỗ trợ dữ liệu

## 🧭 Hướng phát triển tương lai

- Phiên bản Web quản trị dành cho Ban Giáo Lý
- Tích hợp hệ thống chấm điểm, thi giáo lý
- Lưu trữ học bạ điện tử của thiếu nhi

## 📄 License

MIT License © 2025 — HaoPham2703
