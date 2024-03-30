FROM node:20-slim as base

# pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app


# Development
FROM base AS development
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Install ps so we can use the debugger
RUN apt-get update && apt-get install -y procps 

# Utilities
RUN pnpm install -g @nestjs/cli

EXPOSE 1337 9229
CMD [ "pnpm", "start:debug" ]


# Production
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS production
COPY --from=build /app /app
RUN pnpm install --prod --frozen-lockfile

EXPOSE 1337
CMD [ "pnpm", "start:prod" ]