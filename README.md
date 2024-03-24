## Description

API for the shadowverse tools app

## Setup

- Setup [docker](https://www.docker.com/get-started/)
- Create a `.env` file from the `.env.example` template

## Development

```bash
# Start docker compose
$ docker-compose -f docker-compose-dev.yml up

# Querying the database
$ docker exec -it shadowverse-tools-db mysql -p -e 'SELECT * from cards' shadowverse-tools-db

# Migrate
$ docker exec -it shadowverse-tools-api npx sequelize-cli db:migrate
$ docker exec -it shadowverse-tools-api npx sequelize-cli db:seed:all
```
