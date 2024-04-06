## Description

API for the shadowverse tools app using the [NestJS framework](docs.nestjs.com).

## Setup

- Setup [docker](https://www.docker.com/get-started/)
- Create a `.env` file from the `.env.example` template

## Development

```bash
# Start docker compose
$ docker-compose -f docker-compose-dev.yml up

# Querying the database
$ docker exec -it shadowverse-tools-db bash -l
$ > mysql -u {{ USERNAME }} -p shadowverse-tools-db

# Running NestJS CLI commands
$ docker exec -it shadowverse-tools-api nest g [command] [name]

# Migrate
$ docker exec -it shadowverse-tools-api npx sequelize-cli db:migrate
$ docker exec -it shadowverse-tools-api npx sequelize-cli db:seed:all

# Create migration/seeder
$ docker exec -it shadowverse-tools-api npx sequelize-cli migration:create --name name-of-migration
$ docker exec -it shadowverse-tools-api npx sequelize-cli seed:create --name name-of-seeder


```
