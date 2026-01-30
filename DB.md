# Database reset (PostgreSQL in Docker)

This project runs Postgres via `docker-compose.yml` (service: `db`, image: `postgres:16-alpine`).
Default DB name is `writer_future` (configurable via `POSTGRES_DB`).

## Full reset by deleting the Docker volume

This **completely wipes** all data and **re-runs** the init scripts in `docker/postgres/init/` (e.g. `CREATE EXTENSION ...`).

```bash
# Stop containers and delete the named volume(s) for this compose project
docker compose down -v

# Recreate Postgres (fresh volume; init scripts will run)
docker compose up -d db
```