FROM node:lts-alpine3.12 as build
WORKDIR /usr/src/app
COPY package*.json ./
ENV NODE_ENV production
RUN npm install && npm i -g typescript@4.0.3
COPY . .
RUN npm run build

FROM node:lts-alpine3.12
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/dist dist 
EXPOSE 8080
CMD ["npm", "start"]
