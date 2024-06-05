FROM node:20
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=3000
EXPOSE ${PORT}
CMD [ "npm", "start" ]
