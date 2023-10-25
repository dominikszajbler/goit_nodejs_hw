FROM node:14
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]