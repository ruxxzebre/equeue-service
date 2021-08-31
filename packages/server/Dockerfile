FROM node:16-buster

WORKDIR /app
COPY . .

# Fix env variables overlapping
RUN rm -frv .env

RUN yarn
RUN yarn migrane

WORKDIR /app

EXPOSE 3000

CMD ["yarn","server"]
