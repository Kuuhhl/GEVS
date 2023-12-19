#!/bin/sh
set -e
[ -z "$VITE_BACKEND_BASE_URL" ] && echo "VITE_BACKEND_BASE_URL is not set" && exit 1

# Replace env vars in JavaScript files
sed -i -e 's|["'\''"]PLACEHOLDER_BACKEND_BASE_URL["'\''"]|'\"${VITE_BACKEND_BASE_URL}\"'|g' /usr/share/nginx/html/env.js

echo "Starting Nginx"
nginx -g 'daemon off;'