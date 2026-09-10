#!/usr/bin/env bash

docker kill poscally || true 
docker rm poscally || true 
docker create --name poscally -p 3000:3000 -p 4200:4200 localhost/poscally
