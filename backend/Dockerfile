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
    bash

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        gd \
        mbstring \
        intl \
        bcmath \
        opcache

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock* ./

RUN if [ -f composer.lock ]; then \
        composer install --no-dev --no-scripts --no-autoloader --prefer-dist; \
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
        php artisan key:generate --force; \
    fi

RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache \
    && mkdir -p /tmp

COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/supervisord.conf /etc/supervisord.conf

FROM base as development

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
    php artisan config:cache || echo "Config cache failed, continuing..."\n\
fi\n\
\n\
# Start supervisor\n\
exec /usr/bin/supervisord -c /etc/supervisord.conf\n\
' > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]

FROM base as production

COPY docker/php-prod.ini /usr/local/etc/php/conf.d/prod.ini

RUN rm -rf tests .env.example README.md

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
