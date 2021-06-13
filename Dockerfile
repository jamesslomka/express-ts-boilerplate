FROM node:12.10-slim
EXPOSE 5000
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS dependencies
RUN npm install --silent --production

FROM dependencies AS develop
ENV NODE_ENV development
RUN npm install --silent --depth 0
COPY . .
RUN npm run build

FROM base AS release
ENV NODE_ENV production
COPY --from=dependencies /code/node_modules /code/node_modules
COPY --from=develop /code/config ./config/
COPY --from=develop /code/build ./build/

CMD ["node", "build/index.js"]
