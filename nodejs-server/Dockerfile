FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY index.js ./
COPY logger.js ./

EXPOSE 3000

CMD ["npm", "start"]
