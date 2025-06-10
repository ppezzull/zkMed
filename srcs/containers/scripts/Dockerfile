FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Rust and Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Foundry
RUN curl -L https://foundry.paradigm.xyz | bash
ENV PATH="/root/.foundry/bin:${PATH}"
RUN foundryup

# Create app directory
WORKDIR /app

# Copy foundry project
COPY . /app/

# Build contracts
RUN forge build

# Default working directory
WORKDIR /app

# Default command - deploy Greeting contract
CMD ["bash", "./scripts/deploy-demo.sh"] 