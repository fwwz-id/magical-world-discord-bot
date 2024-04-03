FROM node:18-alpine AS builder
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

FROM node:18-alpine AS runner

WORKDIR /home/node/app

COPY --from=builder . .
RUN npm run build

CMD ["npm", "start"]
