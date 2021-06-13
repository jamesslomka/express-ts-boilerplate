FROM node:12.10-slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000
CMD ["node", "build/index.js"]
