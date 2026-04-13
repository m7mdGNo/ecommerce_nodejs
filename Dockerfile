FROM node:alpine

WORKDIR /usr/src/app

# Only copy package variables to cache the 'npm install' step
COPY package*.json ./

RUN npm install

# Copy all source files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
