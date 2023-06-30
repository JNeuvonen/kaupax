#!/bin/bash


DOCKER_IMAGE="jneuv/realtor-updated:latest"
CONTAINER_NAME="realtor-updated"


docker pull $DOCKER_IMAGE


if [ $(docker ps -a -q -f name=$CONTAINER_NAME) ]; then
    docker rm -f $CONTAINER_NAME
fi

docker run -d -p 443:8080 $DOCKER_IMAGE
