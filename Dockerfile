FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn start
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]