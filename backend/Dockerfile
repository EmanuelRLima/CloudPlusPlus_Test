FROM php:8.2-fpm-alpine as base

RUN apk add --no-cache \
    curl \
    git \
    zip \
    unzip \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    supervisor \
    bash \
    procps \
    && rm -rf /var/cache/apk/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        gd \
        mbstring \
        intl \
        bcmath \
        opcache \
        pcntl

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock* ./

# Mudança aqui: instalar todas as dependências (incluindo dev) para evitar problemas
RUN if [ -f composer.lock ]; then \
        composer install --no-scripts --no-autoloader --prefer-dist; \
    else \
        echo "No composer.lock found, skipping composer install"; \
    fi

COPY . .

RUN if [ ! -f artisan ]; then \
        echo "Creating new Laravel project..."; \
        composer create-project --prefer-dist laravel/laravel . && \
        composer require laravel/sanctum; \
    fi

RUN if [ -f artisan ]; then \
        composer dump-autoload --optimize && \
        if [ ! -f .env ]; then \
            if [ -f .env.example ]; then \
                cp .env.example .env; \
            else \
                echo -e "APP_NAME=Laravel\nAPP_ENV=local\nAPP_KEY=\nAPP_DEBUG=true\nAPP_URL=http://localhost\nDB_CONNECTION=pgsql" > .env; \
            fi; \
        fi && \
        php artisan key:generate --force; \
    fi

RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache /var/log \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache \
    && mkdir -p /tmp

COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/supervisord.conf /etc/supervisord.conf

FROM base as development

# Esta linha garante que todas as dependências (incluindo dev) sejam instaladas
RUN if [ -f composer.json ]; then \
        composer install --prefer-dist; \
    fi

COPY docker/php-dev.ini /usr/local/etc/php/conf.d/dev.ini

EXPOSE 8000

RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Wait for database\n\
echo "Waiting for database..."\n\
sleep 10\n\
\n\
# Run migrations if Laravel exists\n\
if [ -f artisan ]; then\n\
    echo "Running Laravel setup..."\n\
    php artisan migrate --force || echo "Migration failed, continuing..."\n\
    php artisan db:seed --force || echo "Seeding failed, continuing..."\n\
    php artisan config:cache || echo "Config cache failed, continuing..."\n\
fi\n\
\n\
# Start supervisor\n\
exec /usr/bin/supervisord -c /etc/supervisord.conf\n\
' > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]

FROM base as production

COPY docker/php-prod.ini /usr/local/etc/php/conf.d/prod.ini

# Em produção, usar apenas as dependências já instaladas no base
# sem tentar reinstalar para evitar conflitos
RUN rm -rf tests .env.example README.md

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
