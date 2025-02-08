# ERC20Manager

## Overview

**ERC20Manager** is a monorepo project designed to manage all ERC-20 tokens on Ethereum for a user. It provides functionalities such as creating new tokens, minting, burning, transferring, and querying token balances. The project is built using a modular architecture to support extensibility and scalability.

## Features

- **Create** new ERC-20 tokens with customizable parameters (name, symbol, decimals, initial supply, etc.).
- **Mint** new tokens to specified addresses.
- **Burn** tokens to reduce supply.
- **Transfer** tokens between accounts.
- **Approve** and **allow** token spending.
- **Query** token balances and allowances.
- **Batch Operations** for efficient token management.

## Project Structure

This monorepo follows a modular structure using **Turborepo** to manage multiple packages efficiently.

```
/erc20manager
│── packages/
│   │── contracts/    # Solidity smart contracts
│   │── sdk/          # JavaScript/TypeScript SDK for interacting with contracts (TODO)
│── apps/
│   │── web-app/       # Frontend UI for token management
│   │── api/          # Backend services for handling requests
│── docs/             # Documentation and guides
│── scripts/          # Deployment and automation scripts
│── tests/            # Unit and integration tests
│── .env              # Environment variables
│── package.json      # Monorepo package configuration
│── README.md         # Project overview and usage guide
```

To work with **Turborepo** Some basic command:

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (>= 18.x)
- **Pnpm** (>= 9.15.x)
- **Hardhat** (for smart contract development)
- **Ethereum Wallet** (e.g., MetaMask extension, Hardhat local node)

### Clone the Repository

```sh
git clone https://github.com/vuonghuuhung/erc20manager
cd erc20manager
pnpm install
```

### Environment Configuration

Create a `.env` file at the root directory with the following variables:

```sh
(TODO)
```

## Usage

### Deploy Smart Contracts

```sh
(TODO)
```

### Interact via CLI

```sh
(TODO)
```

### Interact via SDK (JavaScript/TypeScript)

```ts
TODO;
```

## Turborepo Commands

This project uses **Turborepo** for efficient monorepo management. Here are some basic commands:

- Install a package across all workspaces:
  ```sh
  pnpm install <package> --w
  ```
- Install a package for a specific workspace:
  ```sh
  pnpm install <package> --filter=<workspace>
  ```
- Start APIs and the web app:
  ```sh
  pnpm run dev
  ```

## Pre-Push Checklist

Before pushing changes to GitHub, ensure to run:

```sh
pnpm run lint & pnpm run build
```

## Testing

```sh
pnpm test
```

## Contribution

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See `LICENSE` for more details.
