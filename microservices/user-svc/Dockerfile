# FROM node:12-alpine as build

# WORKDIR /usr/local/users-svc

# ADD dist package.json ./

# RUN apk add --no-cache make g++ python postgresql-dev \
#   && npm install --production

# FROM node:12-alpine

# RUN apk add --no-cache libpq

# ADD https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.3.2/grpc_health_probe-linux-amd64 /bin/grpc_health_probe

# RUN chmod +x /bin/grpc_health_probe

# WORKDIR /usr/local/user-svc

# COPY --from=build /usr/local/user-svc .

# EXPOSE 50052

# CMD ["node", "app.js"]

FROM node:8

WORKDIR /usr/local/user-svc

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 50052 
CMD [ "npm", "start" ]
