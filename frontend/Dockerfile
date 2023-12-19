FROM node:20-alpine as build
WORKDIR /app

ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

COPY package*.json ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:alpine3.18 as serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/entrypoint.sh /usr/share/nginx/html
RUN chmod +x /usr/share/nginx/html/entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/usr/share/nginx/html/entrypoint.sh"]