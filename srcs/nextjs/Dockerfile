FROM node:22-alpine

# Update system and install dependencies
RUN apk update && apk upgrade --no-cache

# Install curl, bash, and git for better development support
RUN apk add --no-cache curl bash git

# Install latest Bun
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with Bun for better performance
RUN bun install

# Expose port
EXPOSE 3000

# Start development server with hot reloading
CMD ["bun", "run", "dev", "--hostname", "0.0.0.0"]
