FROM node:22-alpine AS build
ENV PORT=3000
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN node sync.js
# CMD ["node", "sync.js"]
EXPOSE 3000
CMD ["npm", "run", "start"]