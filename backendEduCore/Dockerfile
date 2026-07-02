# --- Stage 1: install PHP dependencies with Composer -----------------------
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --no-progress

COPY . .
RUN composer dump-autoload --optimize --no-dev

# --- Stage 2: production runtime --------------------------------------------
# serversideup/php ships pdo_mysql, opcache, and a hardened non-root nginx +
# php-fpm setup out of the box, plus a built-in "run migrations on boot"
# automation — no hand-rolled supervisord/nginx config needed.
FROM serversideup/php:8.3-fpm-nginx AS production

WORKDIR /var/www/html

COPY --chown=www-data:www-data --from=vendor /app /var/www/html
# --chmod here (not a later RUN chmod) because by this point the build
# already runs as the non-root image user, which can't touch the base
# image's own pre-existing root-owned scripts in this same directory.
COPY --chown=www-data:www-data --chmod=755 docker/entrypoint.d/ /etc/entrypoint.d/

# Laravel's Dotenv loader throws if no .env file exists at all. Real values
# always come from Koyeb's injected environment variables (those take
# precedence over anything in the file), so this placeholder just has to
# exist — it never supplies an actual secret.
RUN cp -n .env.example .env

# storage/ and bootstrap/cache/ must stay writable by the web server user for
# logs, uploaded-file staging (before it goes to R2), and framework caches.
# (Already owned by www-data from the COPY above, so this is allowed.)
RUN chmod -R 775 storage bootstrap/cache

ENV PHP_OPCACHE_ENABLE=1 \
    AUTORUN_ENABLED=true \
    AUTORUN_LARAVEL_MIGRATION=true \
    AUTORUN_LARAVEL_MIGRATION_FORCE=true \
    AUTORUN_LARAVEL_MIGRATION_DATABASE=mysql \
    AUTORUN_LARAVEL_MIGRATION_TIMEOUT=60

EXPOSE 8080
