# VVMU-PORTFOLIO

# Creative Portfolio Platform

Платформа за творчески портфолиа, разработена като full-stack проект с React, Node.js, Express, TypeScript, Prisma и MySQL.

Проектът позволява на потребители да се регистрират, да влизат в системата, да създават свои творчески проекти, да ги редактират, изтриват, категоризират и харесват.

---

## Използвани технологии

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- bcryptjs

### Frontend
- React
- TypeScript
- Vite

---

## Структура на проекта

```bash
portfolio_vmu/
│
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

---

## Backend setup

Влез в backend папката:

```bash
cd backend
```

Инсталирай пакетите:

```bash
npm install
```

Създай `.env` файл в `backend` папката:

```env
DATABASE_URL="mysql://root:password@localhost:3306/portfolio_db"
JWT_SECRET="your_secret_key"
```

Стартирай Prisma миграциите:

```bash
npx prisma migrate dev
```

Стартирай backend сървъра:

```bash
npm run dev
```

Backend API работи на:

```bash
http://localhost:5000
```

---

# Backend Endpoints

---

## Auth

## Register

```http
POST /auth/register
```

### Body

```json
{
  "name": "Bobi",
  "email": "bobi@example.com",
  "password": "123456"
}
```

### Успешна заявка

```json
{
  "id": 1,
  "name": "Bobi",
  "email": "bobi@example.com",
  "bio": null,
  "avatarUrl": null,
  "createdAt": "2026-04-30T14:09:29.030Z"
}
```

---

## Login

```http
POST /auth/login
```

### Body

```json
{
  "email": "bobi@example.com",
  "password": "123456"
}
```

### Успешна заявка

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Bobi",
    "email": "bobi@example.com",
    "bio": null,
    "avatarUrl": null,
    "createdAt": "2026-04-30T14:09:29.030Z"
  }
}
```

---

## Users

## Update current user

```http
PUT /users/me
```

### Authorization header

```http
Authorization: Bearer jwt_token
```

### Body за смяна на имейл

```json
{
  "email": "newemail@example.com"
}
```

### Body за смяна на парола

```json
{
  "password": "newpassword123"
}
```

### Body за смяна на профилна информация

```json
{
  "name": "New Name",
  "bio": "Creative designer",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Успешна заявка

```json
{
  "id": 1,
  "name": "New Name",
  "email": "newemail@example.com",
  "bio": "Creative designer",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2026-04-30T14:09:29.030Z"
}
```

---

## Projects

## Get all projects

```http
GET /projects
```

Не изисква token.

### Успешна заявка

```json
[
  {
    "id": 1,
    "title": "Portfolio Website",
    "description": "Modern React portfolio website",
    "imageUrl": "https://example.com/image.jpg",
    "toolsUsed": "React, TypeScript, Tailwind CSS",
    "userId": 1,
    "categoryId": 1,
    "createdAt": "2026-04-30T14:16:19.571Z",
    "updatedAt": "2026-04-30T14:41:35.101Z",
    "user": {
      "id": 1,
      "name": "Bobi",
      "bio": null,
      "avatarUrl": null
    },
    "category": {
      "id": 1,
      "name": "Web Design"
    },
    "_count": {
      "likes": 3
    }
  }
]
```

---

## Get project by ID

```http
GET /projects/:id
```

### Пример

```http
GET /projects/1
```

Не изисква token.

---

## Create project

```http
POST /projects
```

### Authorization header

```http
Authorization: Bearer jwt_token
```

### Body

```json
{
  "title": "Creative Website",
  "description": "Modern portfolio project",
  "imageUrl": "https://example.com/image.jpg",
  "toolsUsed": "React, TypeScript, Node.js",
  "categoryId": 1
}
```

Важно: `userId` не се изпраща в body. Той се взима автоматично от JWT token-а.

### Успешна заявка

```json
{
  "id": 2,
  "title": "Creative Website",
  "description": "Modern portfolio project",
  "imageUrl": "https://example.com/image.jpg",
  "toolsUsed": "React, TypeScript, Node.js",
  "userId": 1,
  "categoryId": 1,
  "createdAt": "2026-04-30T14:16:19.571Z",
  "updatedAt": "2026-04-30T14:16:19.571Z"
}
```

---

## Update project

```http
PUT /projects/:id
```

### Пример

```http
PUT /projects/1
```

### Authorization header

```http
Authorization: Bearer jwt_token
```

### Body

```json
{
  "title": "Updated Project",
  "description": "Updated project description",
  "imageUrl": "https://example.com/updated-image.jpg",
  "toolsUsed": "React, Prisma, MySQL",
  "categoryId": 1
}
```

Важно: потребителят може да редактира само собствените си проекти.

---

## Delete project

```http
DELETE /projects/:id
```

### Пример

```http
DELETE /projects/1
```

### Authorization header

```http
Authorization: Bearer jwt_token
```

Важно: потребителят може да изтрие само собствените си проекти.

### Успешна заявка

```json
{
  "message": "Project deleted successfully"
}
```

---

## Categories

## Get all categories

```http
GET /categories
```

Не изисква token.

---

## Get category by ID

```http
GET /categories/:id
```

### Пример

```http
GET /categories/1
```

Не изисква token.

---

## Create category

```http
POST /categories
```

### Body

```json
{
  "name": "Photography"
}
```

### Успешна заявка

```json
{
  "id": 2,
  "name": "Photography"
}
```

---

## Update category

```http
PUT /categories/:id
```

### Пример

```http
PUT /categories/1
```

### Body

```json
{
  "name": "Digital Photography"
}
```

---

## Delete category

```http
DELETE /categories/:id
```

### Пример

```http
DELETE /categories/1
```

Важно: ако категорията се използва от проект, изтриването може да бъде отказано заради връзка в базата данни.

### Успешна заявка

```json
{
  "message": "Category deleted successfully"
}
```

---

## Likes

## Get likes count for project

```http
GET /projects/:projectId/likes
```

### Пример

```http
GET /projects/1/likes
```

Не изисква token.

### Успешна заявка

```json
{
  "likesCount": 3
}
```

---

## Like project

```http
POST /projects/:projectId/likes
```

### Пример

```http
POST /projects/1/likes
```

### Authorization header

```http
Authorization: Bearer jwt_token
```

Body не е нужен. `userId` се взима автоматично от JWT token-а.

### Успешна заявка

```json
{
  "id": 1,
  "userId": 1,
  "projectId": 1,
  "createdAt": "2026-04-30T14:16:19.571Z"
}
```

---

## Unlike project

```http
DELETE /projects/:projectId/likes
```

### Пример

```http
DELETE /projects/1/likes
```

### Authorization header

```http
Authorization: Bearer jwt_token
```

Body не е нужен. `userId` се взима автоматично от JWT token-а.

### Успешна заявка

```json
{
  "message": "Project unliked successfully"
}
```

---

# Основни функционалности

- Регистрация на потребители
- Вход в системата
- JWT authentication
- Хеширане на пароли с bcrypt
- CRUD операции за проекти
- CRUD операции за категории
- Харесване и премахване на харесване
- Брой харесвания към проект
- Ownership check при редакция и изтриване на проект
- Скриване на пароли и имейли при публични заявки за проекти
- MySQL база данни
- Prisma ORM
- TypeScript backend
- OOP структура чрез service класове
- Git/GitHub version control

---

# Database Models

Основни таблици:

- User
- Project
- Category
- Like

Връзки:

```text
User 1 → many Projects
User 1 → many Likes
Category 1 → many Projects
Project 1 → many Likes
```

---