#!/bin/bash

# Remove all containers
docker rm $(docker ps -a -q)

# prune all images
docker image prune -a -f

# prune all volumes
docker volume prune -f