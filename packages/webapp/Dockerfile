FROM node:14-alpine as build-stage
RUN apk add g++ make python

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn webappbuild

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/packages/webapp/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
