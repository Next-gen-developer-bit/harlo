#!/bin/bash

set -o xtrace

docker rmi localhost/poscally || true
docker build --target dist -t localhost/poscally -f Dockerfile.dev .
docker build --target devcontainer -t localhost/poscally-devcontainer -f Dockerfile.dev .
