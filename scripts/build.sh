#!/usr/bin/env bash

cd api-gateway && npm run copy:protos && npm run build && cd -
cd microservices/user-svc && npm run copy:protos && npm run build && cd -
cd microservices/graphql-user-svc && npm run copy:protos && npm run build && cd -
docker-compose build --no-cache
