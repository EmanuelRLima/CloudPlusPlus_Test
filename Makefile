.PHONY: help build up down restart logs shell test clean

help:
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup:
	@echo "Setting up the project..."
	@cp backend/.env.example backend/.env 2>/dev/null || true
	@cp frontend/.env.example frontend/.env 2>/dev/null || true
	@echo "Environment files created. Please review and update them as needed."

build:
	docker-compose build

build-no-cache:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

stop:
	docker-compose stop

dev:
	@make up
	@echo "Waiting for services to be ready..."
	@sleep 10
	@make migrate
	@echo "Development environment is ready!"
	@echo "Frontend: http://localhost"
	@echo "Backend API: http://localhost/api"

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-nginx:
	docker-compose logs -f nginx

logs-db:
	docker-compose logs -f postgres

shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-db:
	docker-compose exec postgres psql -U postgres -d hiring_test

key-generate:
	docker-compose exec backend php artisan key:generate

migrate:
	docker-compose exec backend php artisan migrate

migrate-fresh:
	docker-compose exec backend php artisan migrate:fresh --seed

seed:
	docker-compose exec backend php artisan db:seed

cache-clear:
	docker-compose exec backend php artisan cache:clear
	docker-compose exec backend php artisan config:clear
	docker-compose exec backend php artisan route:clear
	docker-compose exec backend php artisan view:clear

optimize:
	docker-compose exec backend php artisan config:cache
	docker-compose exec backend php artisan route:cache
	docker-compose exec backend php artisan view:cache

npm-install:
	docker-compose exec frontend npm install

npm-build:
	docker-compose exec frontend npm run build

npm-test:
	docker-compose exec frontend npm run test

npm-lint:
	docker-compose exec frontend npm run lint

test:
	@make test-backend
	@make test-frontend

test-backend:
	docker-compose exec backend php artisan test

test-frontend:
	docker-compose exec frontend npm run test

db-backup:
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U postgres hiring_test > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backup created in backups/ directory"

db-restore:
	@if [ -z "$(FILE)" ]; then echo "Usage: make db-restore FILE=backup_file.sql"; exit 1; fi
	docker-compose exec -i postgres psql -U postgres hiring_test < $(FILE)

health:
	@echo "Checking service health..."
	@echo "Nginx: $(shell curl -s -o /dev/null -w "%{http_code}" http://localhost/health 2>/dev/null || echo "Failed")"
	@echo "Backend: $(shell curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health 2>/dev/null || echo "Failed")"
	@echo "Database: $(shell docker-compose exec postgres pg_isready -U postgres >/dev/null 2>&1 && echo "Ready" || echo "Not Ready")"
	@echo "Redis: $(shell docker-compose exec redis redis-cli ping 2>/dev/null || echo "Failed")"

status:
	docker-compose ps

clean:
	docker-compose down -v --rmi local

clean-all:
	docker-compose down -v --rmi all
	docker system prune -f

reset:
	@make clean
	@make setup
	@make build
	@make dev

prod-build:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

ssl-generate:
	@mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/ssl/localhost.key \
		-out nginx/ssl/localhost.crt \
		-subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
	@echo "SSL certificates generated in nginx/ssl/"

stats:
	docker stats

top:
	@echo "Backend processes:"
	@docker-compose exec backend ps aux
	@echo "\nFrontend processes:"
	@docker-compose exec frontend ps aux

quick-restart-backend:
	docker-compose restart backend

quick-restart-frontend:
	docker-compose restart frontend

install:
	@echo "Starting complete installation..."
	@make setup
	@make build
	@make up
	@echo "Waiting for services..."
	@sleep 15
	@make key-generate
	@make migrate
	@echo "Installation complete!"
	@make health