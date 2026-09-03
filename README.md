# MeChat API

A real-time messaging API built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, and Socket.IO. The API powers the MeChat frontend and handles authentication, users, conversations, messaging, online presence, and real-time communication.

## Live API

<https://mechat-api.onrender.com>

## Project Ecosystem
MeChat
├── MeChat Frontend

└── MeChat API


The frontend provides the user interface, while the API manages application logic, authentication, database operations, and real-time communication.

## Features
* User registration and login
* Demo login
* JWT-based authentication using HTTP-only cookies
* Guest and authenticated route protection
* User search
* Profile editing
* Direct conversations
* Group conversation creation
* Conversation participants and roles
* Message creation and message history
* Online/offline user presence
* Support for multiple active connections per user
* Real-time messaging and presence updates with Socket.IO
* Input validation and authentication middleware
* CORS configuration for local development and production
* PostgreSQL database integration with Prisma ORM

## Planned / In Progress

The project is actively being developed. The following features are represented in the database design but are not fully implemented yet:

* Message reactions
* Message read receipts
* Last-seen functionality
* More complete media functionality
* Small-screen/mobile responsiveness


The current frontend is optimized for medium and large screen sizes, with smaller-screen support planned as the project grows.

## Tech Stack
* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Socket.IO
* JWT
* HTTP-only cookies
* express-validator
* Axios-compatible REST API communication
* Render
* Architecture

The API follows a layered backend architecture:

Client
  │
  ├── REST API

  │
  └── Socket.IO

        │
        ▼
┌───────────────────────────┐
│        Express API        │
├───────────────────────────┤
│ Routes                    │
│ Controllers               │
│ Middleware                │
│ Services                  │
│ Socket.IO                 │
└─────────────┬─────────────┘
              │
              ▼

       ┌──────────────┐
       │ Prisma ORM   │
       └──────┬───────┘
              │
              ▼

       ┌──────────────┐
       │ PostgreSQL   │
       └──────────────┘

## Backend Structure
src

├── config
│   └── env.ts

├── controllers
│   ├── auth.controller.ts

│   ├── conversation.controller.ts

│   ├── message.controller.ts

│   └── user.controller.ts

├── lib
│   ├── lib.socket.ts

│   └── prisma.ts

├── middlewares
│   ├── auth.middleware.ts

│   ├── auth.validator.ts

│   ├── user.validator.ts

│   └── validate.middleware.ts
├── prisma
│   └── client.ts

├── routes
│   ├── auth.routes.ts

│   ├── conversation.routes.ts

│   ├── message.routes.ts

│   └── user.routes.ts
├── services
│   ├── auth.service.ts

│   ├── conversation.service.ts

│   ├── message.service.ts

│   ├── presence.service.ts

│   └── user.service.ts
├── types

├── utils

├── validators

├── app.ts

├── server.ts

└── socket.ts


The project separates HTTP routing, controllers, business logic, validation, authentication, database access, and real-time communication into dedicated layers.

## Real-Time Communication

MeChat uses Socket.IO alongside the REST API for real-time functionality.

Socket.IO is responsible for:

* Establishing authenticated socket connections
* Tracking connected users
* Maintaining multiple active socket connections per user
* Broadcasting online/offline presence
* Joining and leaving conversation rooms
* Sending user-specific events through personal rooms
* Supporting real-time communication between connected clients

Authentication is applied to socket connections by validating the JWT stored in the accessToken HTTP-only cookie.

## Socket Architecture
Frontend
    │

    │ Socket.IO
    ▼

Socket.IO Server
    │

    ├── Authentication

    ├── User Rooms

    ├── Conversation Rooms

    └── Presence Tracking

## Authentication & Security

Authentication is handled using JSON Web Tokens stored in HTTP-only cookies.

The authentication flow is:

Login / Registration

        │
        ▼
Generate JWT

        │
        ▼

HTTP-only accessToken cookie
        │
        ▼
        
Authenticated API requests


The backend uses:

* JWT authentication
* HTTP-only cookies
* Environment variables for sensitive configuration
* Authentication middleware for protected routes
* Socket authentication using the same JWT cookie
* CORS restrictions for trusted frontend origins
* Request validation middleware

In production, authentication cookies use secure cross-site cookie settings so the deployed frontend can communicate with the deployed API.

## Database

MeChat uses PostgreSQL with Prisma ORM.

The current database models include:

* Users
* Profiles
* Conversations
* Conversation participants
* Messages
* Media
* Message media
* Message reactions
* Message read receipts

The database also supports:

* Direct and group conversations
* Conversation participant roles
* User presence information
* Message relationships
* Profile information
* Database indexes for commonly queried fields
* Unique constraints for users and conversation membership

Prisma migrations are stored in the repository and Prisma Client is generated during deployment.

## API Endpoints

The API is organized into four primary route groups.

### Authentication
POST /api/auth/register

POST /api/auth/login

POST /api/auth/demo

GET  /api/auth/me

POST /api/auth/logout

Handles registration, authentication, demo access, retrieving the authenticated user, and logout.

### Conversations
GET  /api/conversations

POST /api/conversations


Handles conversation retrieval and conversation creation.

### Messages
GET  /api/messages

POST /api/messages


Handles message retrieval and creation.

### Users
GET  /api/users

Handles user-related operations such as searching for users.

Endpoint details may expand as additional MeChat features are implemented.

## Environment Variables

The backend uses environment variables for database credentials, authentication secrets, and frontend origins.

DATABASE_URL=

JWT_SECRET=

DEMO_USERNAME=

FRONTEND_URL=http://localhost:3000

FRONTEND_PROD_URL=https://me-chat-eta.vercel.app

PORT is not required locally because the server falls back to port 5000:

const PORT = process.env.PORT || 5000;


Render provides the production port through its environment.

## Local Development

Clone the repository:

git clone <https://github.com/MrVyde/mechat-api.git>

cd mechat-app

Install dependencies:

npm install

Create a .env file in the project root:

DATABASE_URL=
JWT_SECRET=
DEMO_USERNAME=
FRONTEND_URL=http://localhost:3000
FRONTEND_PROD_URL=


Generate the Prisma client:

npx prisma generate

Run the development server:

npm run dev

The API will be available at:

http://localhost:5000

## Available Scripts
npm run dev

Starts the development server using Nodemon and TSX.

npm run build

Generates the Prisma client for deployment.

npm start


Starts the production server.

## Deployment

The backend is deployed on Render.

The deployment process uses:

npm run build

to generate the Prisma client before starting the server with:

npm start


The production API is available at:

<https://mechat-api.onrender.com>


The frontend is deployed separately on Vercel.

Frontend:
<https://me-chat-eta.vercel.app>

Backend:
<https://mechat-api.onrender.com>


CORS is configured to allow both the local development frontend and the deployed frontend.

# Project Development

MeChat is an actively evolving project. The backend architecture is designed to support additional messaging functionality as development continues.

Planned improvements include message reactions, read receipts, last-seen functionality, expanded media support, and improved small-screen responsiveness.

## What This Project Demonstrates
* REST API design with Express
* TypeScript backend development
* Layered backend architecture
* JWT authentication
* HTTP-only cookie authentication
* Authentication middleware
* Request validation
* Real-time communication with Socket.IO
* WebSocket authentication
* Real-time presence tracking
* Conversation and messaging architecture
* PostgreSQL database design
* Prisma ORM and migrations
* Environment-based configuration
* CORS configuration
* Production deployment with Render
* Frontend/backend integration
* Building and evolving a full-stack application

## Related Project

### MeChat Frontend

The frontend application provides the user interface for authentication, conversations, messaging, user management, and real-time interaction.

<https://me-chat-eta.vercel.app>

### Repository
<https://github.com/MrVyde/mechat-api>