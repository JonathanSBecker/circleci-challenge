FROM node
ENV MYSQL2_URL=localhost
ENV MYSQL2_USER=root
ENV MYSQL2_PASSWORD=password
ENV MYSQL2_DATABASE=dbmate_demo
WORKDIR /app
COPY package.json /app
RUN npm install
COPY /src /app
CMD ["node","server.js"]
