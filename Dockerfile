FROM    node:latest
WORKDIR /app
COPY  package.json .
ARG NODE_ENV
RUN if [ ${NODE_ENV}="development" ]; \
      then  npm install;  \
      else  npm install --only=production;  \
      fi
COPY    . ./
ENV     PORT 7000
EXPOSE ${PORT}
CMD    ["node", "index.js"]

FROM nginx:stable-alpine
COPY ./nginx/default.conf /et/nginx/conf.d/default.conf
