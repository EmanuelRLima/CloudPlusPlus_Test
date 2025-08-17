# CloudPlusPlus_Test Project

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Git
- Php (version 8.x.x)
- Node (version 22.x)
- Make (optional, for convenience)

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/EmanuelRLima/CloudPlusPlus_Test.git
cd CloudPlusPlus_Test
```


## 2. Running the Project

## If you have make installed

```bash
make install
```

## If you don't have make installed

```bash
# Create env files to backend and frontend
cp backend/.env.example backend/.env 2>/dev/null || true
cp frontend/.env.example frontend/.env 2>/dev/null || true

# Build containers
docker-compose up --build -d

# Activate containers
docker-compose up -d

# Generate Key
docker-compose exec backend php artisan key:generate

# Migrate tables backend
docker-compose exec backend php artisan migrate

# Seeds in database backend
docker-compose exec backend php artisan db:seed

# Permissions
docker-compose exec backend chmod -R 777 bootstrap/cache

docker-compose exec backend chmod -R 777 storage
```

### Service Verification

After initialization, check if all services are running:

```bash
docker-compose ps -a
```

## Accessing the Application

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost/api
- **Frontend direct**: http://localhost:5173 (development)
- **Backend direct**: http://localhost:8000 (development)

## Useful Commands

### Container management

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart a specific service
docker-compose restart backend

# View logs of a service
docker-compose logs backend
docker-compose logs -f frontend  # follow logs

# Execute commands in backend container
docker-compose exec backend bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan tinker
```

### Laravel Commands (Backend)

```bash
# Run tests
docker-compose exec backend php artisan test

# Cache
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache

# Tinker (Laravel REPL)
docker-compose exec backend php artisan tinker
```

### VueJS Commands (Frontend)

```bash
# Run tests
docker-compose exec frontend npm test:ci

# Build for production
docker-compose exec frontend npm run build
```

## 3. Troubleshooting

### Issue: Services don't start

1. Check if ports are not in use:
   ```bash
   lsof -i :80,443,5432,6379,8000,5173
   ```

2. Rebuild containers:
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up
   ```

## 4. Health Checks

The project includes health checks for all services:

- **PostgreSQL**: `pg_isready -U postgres`
- **Redis**: `redis-cli ping`
- **Backend**: `curl -f http://localhost:8000/api/health`
- **Nginx**: `curl -f http://localhost/health`

## 5. User credentials example

- **User**
  - Email: demo@example.com
  - Username: Example_Example
  - Password: 123456789

## 6. API examples

- **Swagger**: http://localhost/api/documentation

## 7. Project structure

```bash
├── backend/
│   ├── app/
│   │   ├── Exceptions/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/ # APIs "Task, Projects, Login and registration.
│   │   │   │   │
│   │   │   ├── Requests/ # Requests "Task, Projects, Login and registration.
│   │   │   ├── Resources/ # Resources "Task, Projects, Login and registration.
│   │   ├── Models/     # Models used in controllers
│   │   ├── Policies/   # Policies Rules business project
│   │   └── Services/   # Authentication service logic
│   ├── public/ # Swagger documentation
│   ├── routes/ # Project routes
│   ├── tests/ # Project tests
│   ├── Dockerfile
│   ├── docker/
│   │   ├── php.ini
│   │   ├── php-dev.ini
│   │   ├── php-prod.ini
│   │   └── supervisord.conf
├── frontend/               # Node.js application
│   ├── src/
│   │   ├── components/     # Vue.js components
│   │   ├──├── auth/           # Login and registration components
│   │   ├──├── common/         # Reusable components for the application
│   │   ├──├── dashboard/      # Dashboard components
│   │   ├──├── forms/          # Login and registration form components
│   │   ├──├── layout/         # Side and Menubar
│   │   ├──├── project/        # Project components
│   │   ├───├──├── projectDetails/
│   │   ├───├──├── projectForm/
│   │   ├───├──├── projectList/
│   │   ├── ├──tasks/          # Task components
│   │   ├───├── taskDetails/
│   │   ├───├── taskForm/
│   │   ├───├── taskList/
│   │   ├── utils/         # Utility functions
│   │   ├── composables/     # Reusable functions
│   │   ├── router/     # System routes and guards
│   │   ├── services/   # Axios
│   │   ├── stores/     # Pinia, API calls
│   │   ├── types/     # Next steps
│   │   ├── views/     # System views
│   ├── Dockerfile
│   ├── docker/
│   │   └── nginx.conf
│   └── ...
├── nginx/                  # Nginx configuration
│   ├── default.conf
│   └── ssl/
├── docker-compose.yml
└── README.md
```

## 8. Trade-offs

1. Complexity vs Simplicity

  - Trade-off: More moving parts (Laravel + Vue + Docker + Nginx)
  - Benefit: Better separation of concerns and scalability
  - Cost: Higher learning curve and deployment complexity

2. Network Latency

  - Trade-off: API calls between frontend and backend
  - Benefit: True decoupling allows independent scaling
  - Cost: Additional HTTP overhead compared to server-side rendering

3. Development vs Production Environments

  - Trade-off: Different PHP configurations (dev/prod ini files)
  - Benefit: Optimized performance per environment
  - Cost: Configuration drift risk


## 9. Next steps for production readiness

 - Implementation of email notifications when a user registers
 - OTP model for authentication
 - Project collaboration, allowing adding collaborators within projects and linking to tasks
 - Notifications for important events (e.g.: new tasks, comments)
 - User profile updates
 - Redis implementation for session caching


## 10. Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/xxxx`)
3. Commit your changes (`git commit -m 'Add some xxxx'`)
4. Push to the branch (`git push origin feature/xxxx`)
5. Open a Pull Request