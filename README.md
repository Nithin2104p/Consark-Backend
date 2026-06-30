# Consark Backend

REST API for Consark Full Stack Dev Assessment - a multi-tenant task management system with RBAC.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** (v5) - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Zod** - Schema validation
- **Docker** - Containerization

## Project Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or remote)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@example.com
```

## Available Commands

### Development

```bash
npm run dev             # Start development server with nodemon (hot reload)
npm run server          # Start production server with node
```

### Database Seeding

```bash
npm run seed            # Run all seed scripts in order
npm run seed:permissions     # Seed permissions
npm run seed:roles           # Seed roles
npm run seed:role-permissions # Seed role-permission mappings
npm run seed:companies       # Seed companies
npm run seed:users           # Seed users
npm run seed:user-roles      # Seed user-role mappings
```

## Docker

### Development with Docker

```bash
docker-compose up       # Build and start containers (app + mongo)
docker-compose down     # Stop and remove containers
```

### Production Build

```bash
docker build -t consark-backend .
docker run -p 3000:3000 consark-backend
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/set-password` | Set password via invitation token |

### Users (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me/companies` | Get user's companies |
| POST | `/api/users` | Create user |
| GET | `/api/users` | List all users (paginated) |
| GET | `/api/users/count` | Get total user count |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (soft delete) |

### Tasks (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | List all tasks (paginated) |
| GET | `/api/tasks/count` | Get task counts by status |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task (soft delete) |

## Scripts

Seed scripts in `src/scripts/`:
- `seedPermissions.js` - Upserts permissions
- `seedRoles.js` - Upserts roles (user, admin, super_admin)
- `seedRolePermissions.js` - Maps permissions to roles
- `seedCompanies.js` - Creates default company
- `seedUsers.js` - Creates sample users with hashed passwords
- `seedUserRoles.js` - Maps users to roles
- `migrateUserEmailIndex.js` - Migration script for email index

## License

ISC