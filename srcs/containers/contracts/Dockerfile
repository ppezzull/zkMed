FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    git \
    build-essential \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Rust and Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Foundry
RUN curl -L https://foundry.paradigm.xyz | bash
ENV PATH="/root/.foundry/bin:${PATH}"
RUN foundryup

# Install Bun for vlayer dependencies
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Create app directory
WORKDIR /app

# Copy foundry project and vlayer setup
COPY foundry/ /app/foundry/
COPY demo-data/ /app/demo-data/

# Create scripts directory
COPY scripts/ /app/foundry/scripts/

# Make scripts executable
RUN chmod +x /app/foundry/scripts/*.sh

# Install vlayer dependencies
WORKDIR /app/foundry/vlayer
RUN bun install

# Back to foundry directory
WORKDIR /app/foundry

# Build contracts
RUN forge build

# Default working directory
WORKDIR /app/foundry

# Default command - deploy demo contracts and setup accounts
CMD ["./scripts/deploy-demo.sh"] 