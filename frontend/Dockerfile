FROM node:18.13.0

ENV NODE_OPTIONS="--openssl-legacy-provider"

WORKDIR /frontend

COPY . /frontend

COPY package*.json ./

RUN npm install

RUN npm audit

EXPOSE 3000

CMD ["npm", "start"]
