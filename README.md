# EduZone - Educational Management System

EduZone is a comprehensive educational management system that helps schools and educational institutions manage their resources, schedules, and communications effectively.

## Features

- 🔐 Secure Authentication System
- 📚 Library Management
- 📅 Calendar & Event Management
- 👥 User Role Management (Admin, Teacher, Student, Parent, Librarian)
- 💬 Feedback System
- 📝 Form Management
  - Public access to view and download forms
  - Admin-only form management (upload, edit, delete)
  - Category-based organization
  - Search and filter capabilities
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack

### Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt for password hashing

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- React Router DOM

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/eduzone.git
cd eduzone
```

2. Set up the backend:

```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following content:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=eduzone_db
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

4. Initialize the database:

```bash
npm run init-db
```

5. Start the backend server:

```bash
npm run dev
```

6. Set up the frontend:

```bash
cd ../frontend/Edu-Zone
npm install
```

7. Create a `.env` file in the frontend directory with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

8. Start the frontend development server:

```bash
npm run dev
```

## Default Admin Account

- Email: admin@eduzone.com
- Password: admin123

## Project Structure

```
eduzone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── index.js
│   ├── package.json
│   └── .env
└── frontend/
    └── Edu-Zone/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── lib/
        │   ├── hooks/
        │   └── types/
        ├── package.json
        └── .env
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user info

### Books

- GET `/api/books` - Get all books
- POST `/api/books` - Add a new book
- PUT `/api/books/:id` - Update a book
- DELETE `/api/books/:id` - Delete a book

### Calendar

- GET `/api/calendar` - Get all events
- POST `/api/calendar` - Create a new event
- PUT `/api/calendar/:id` - Update an event
- DELETE `/api/calendar/:id` - Delete an event

### Feedback

- GET `/api/feedback` - Get all feedback
- POST `/api/feedback` - Submit feedback
- DELETE `/api/feedback/:id` - Delete feedback

### Forms

- GET `/api/forms` - Get all forms (public access)
- POST `/api/forms` - Upload a new form (admin only)
- PUT `/api/forms/:id` - Update a form (admin only)
- DELETE `/api/forms/:id` - Delete a form (admin only)
- GET `/api/forms/download/:id` - Download a form (public access)

## Development

### Backend Development

```bash
cd backend
npm run dev
```

### Frontend Development

```bash
cd frontend/Edu-Zone
npm run dev
```

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend/Edu-Zone
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@eduzone.com or open an issue in the repository.
