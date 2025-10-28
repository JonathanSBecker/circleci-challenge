FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY /src /app
CMD ["node","index.js"]
