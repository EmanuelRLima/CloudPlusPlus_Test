# CloudPlusPlus_Test Project

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Git
- Php (version 8.4.x)
- Node (version 22.x)

## Setup and Installation

### 1. Clone the repository

```bash
git clone <https://github.com/EmanuelRLima/CloudPlusPlus_Test.git>
cd CloudPlusPlus_Test
```

### 2. Environment variables configuration

#### Backend (Laravel)
If there's no `.env` file in the `backend/` directory, one will be created automatically during build. You can customize the settings by editing the `.env` file:

```bash
# backend/.env (will be created automatically)
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:Pm9FW8JnsZDA5sHtGFv44EsdXDQH1Pz5WWnunGJ5UAg=
APP_DEBUG=true
APP_URL=http://localhost

L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_USE_ABSOLUTE_PATH=true

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=hiring_test
DB_USERNAME=postgres
DB_PASSWORD=postgres

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
```

#### Frontend
Frontend environment variables are configured directly in `docker-compose.yml`:

- `NODE_ENV=development`
- `VITE_API_URL=http://localhost/api`

### 3. Nginx Configuration

Make sure the `nginx/default.conf` file exists with the reverse proxy configuration for backend and frontend.

## Running the Project

### Development (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### Service Verification

After initialization, check if all services are running:

```bash
docker-compose ps -a
```

All services should have "healthy" status after a few minutes.

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
# Migrations
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan migrate:fresh --seed

# Cache
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache

# Tinker (Laravel REPL)
docker-compose exec backend php artisan tinker
```

### VueJS Commands (Frontend)

```bash
# Install dependencies
docker-compose exec frontend npm install

# Run tests
docker-compose exec frontend npm test:ci

# Build for production
docker-compose exec frontend npm run build
```

### Database

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d hiring_test

# Database backup
docker-compose exec postgres pg_dump -U postgres hiring_test > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres -d hiring_test < backup.sql
```

## Troubleshooting

### Issue: Services don't start

1. Check if ports are not in use:
   ```bash
   lsof -i :80,443,5432,6379,8000,5173
   ```

2. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

### Issue: Database doesn't connect

1. Check if PostgreSQL is healthy:
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

2. Check logs:
   ```bash
   docker-compose logs postgres
   docker-compose logs backend
   ```

### Issue: Frontend can't access API

1. Check if the `VITE_API_URL` variable is correct
2. Check Nginx logs:
   ```bash
   docker-compose logs nginx
   ```

### Issue: Laravel permissions

```bash
# Fix permissions
docker-compose exec backend chown -R www-data:www-data /var/www/html
docker-compose exec backend chmod -R 755 storage bootstrap/cache
```

## Health Checks

The project includes health checks for all services:

- **PostgreSQL**: `pg_isready -U postgres`
- **Redis**: `redis-cli ping`
- **Backend**: `curl -f http://localhost:8000/api/health`
- **Nginx**: `curl -f http://localhost/health`

## User credentials example

- **User**
  - Email: demo@example.com
  - Username: Example_Example
  - Password: 123456789

## API examples

- **Swagger**: http://localhost/api/documentation

## Project structure

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

## Trade-offs

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


## Next steps for production readiness

 - Implementation of email notifications when a user registers
 - OTP model for authentication
 - Project collaboration, allowing adding collaborators within projects and linking to tasks
 - Notifications for important events (e.g.: new tasks, comments)
 - User profile updates
 - Redis implementation for session caching


## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/xxxx`)
3. Commit your changes (`git commit -m 'Add some xxxx'`)
4. Push to the branch (`git push origin feature/xxxx`)
5. Open a Pull Request