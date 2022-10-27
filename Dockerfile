# syntax=docker/dockerfile:1

FROM node:16

ENV NODE_ENV=dev


WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "package-lock.json*", "./"]

# Install gatttool
RUN sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "index.js" ]