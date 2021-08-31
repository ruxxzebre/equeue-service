FROM node:16-buster as build-stage
# Not alpine, because it's really garbage

WORKDIR /app
COPY . .

# Fix env variables overlapping, if .env already exists
RUN rm -frv packages/server/.env
RUN rm -frv packages/webapp/.env

# For making env from compose be available during build
# So MAKE SURE TO PASS ENV VARIABLES IN ARGS when using Docker Compose
ARG VUE_APP_BASE_PORT
ENV VUE_APP_BASE_PORT=${VUE_APP_BASE_PORT}

RUN yarn
RUN yarn webappbuild

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/packages/webapp/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
