
## Getting started
```
# Step 1
Download repo

# Step 2
Add .env file to root (See below)

# Step 3
docker-compose build

# Step 4
docker-compose up
or
docker-compose up -d

# Step 5 (Find the container name)
docker container ls

# Step 6 (Access the container shell)
docker container exec -it NAMES /bin/bash

```
## Pre-commit lint hook
Following steps are required for auto-linting code before commit.
```
# Step 1
pip install pre-commit

# Step 2
pre-commit install


## Access URLs (local)
```
backend:

API          http://localhost:<port>/api

API Admin    http://localhost:<port>/admin/

frontend:

Main        http://localhost:<port>/
```


## Delete everything and rebuild (Destructive!)
```
docker-compose down

docker volume ls

docker volume rm VOLUME_NAME

docker system prune -a

docker build --no-cache .

docker-compose up -d --build
```
