#!/usr/bin/env bash

cd api-gateway && npm i && cd -
cd microservices/user-svc && npm i && cd -
cd microservices/graphql-user-svc && npm i && cd -
