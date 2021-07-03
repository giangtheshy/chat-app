
FROM node:14-alpine3.10 as builder

LABEL version="1.0"
LABEL description="React Webpack for FrontEnd of the Chat app"

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html