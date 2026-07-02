#!/bin/sh
# Aiven's managed MySQL requires TLS. The CA certificate content is passed in
# as a (multi-line) env var — MYSQL_SSL_CA_CONTENT — since Koyeb has no
# built-in concept of "mount this file". We write it to disk here, once, at
# boot, and MYSQL_ATTR_SSL_CA (set separately) points Laravel's PDO
# connection at that path. No-op locally / anywhere that var isn't set.
set -e

if [ -n "$MYSQL_SSL_CA_CONTENT" ]; then
  mkdir -p /var/www/html/storage/app/certs
  printf '%s\n' "$MYSQL_SSL_CA_CONTENT" > /var/www/html/storage/app/certs/aiven-ca.pem
  chmod 644 /var/www/html/storage/app/certs/aiven-ca.pem
fi
