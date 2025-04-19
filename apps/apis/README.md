### Database Creation

Create a sqlite database called `events.db` at "apps/apis/data" directory, then create tables using:

```sql
CREATE TABLE IF NOT EXISTS ERC20FactoryEvents (
id INTEGER PRIMARY KEY AUTOINCREMENT,
contractAddress TEXT NOT NULL,
blockNumber INTEGER NOT NULL,
blockTimestamp INTEGER NOT NULL,
transactionHash TEXT NOT NULL,
logIndex INTEGER NOT NULL,
ownerAddress TEXT NOT NULL,
tokenAddress TEXT NOT NULL,
amount TEXT NOT NULL,
UNIQUE(transactionHash, logIndex)
);

CREATE INDEX IF NOT EXISTS idx_erc20factory_contract ON ERC20FactoryEvents(contractAddress);
CREATE INDEX IF NOT EXISTS idx_erc20factory_block ON ERC20FactoryEvents(blockNumber);
CREATE INDEX IF NOT EXISTS idx_erc20factory_owner ON ERC20FactoryEvents(ownerAddress);
CREATE INDEX IF NOT EXISTS idx_erc20factory_token ON ERC20FactoryEvents(tokenAddress);

```

```sql
CREATE TABLE IF NOT EXISTS DAOFactoryEvents (
id INTEGER PRIMARY KEY AUTOINCREMENT,
contractAddress TEXT NOT NULL,
blockNumber INTEGER NOT NULL,
blockTimestamp INTEGER NOT NULL,
transactionHash TEXT NOT NULL,
logIndex INTEGER NOT NULL,
daoAddress TEXT NOT NULL,
tokenAddress TEXT NOT NULL,
amount TEXT NOT NULL,
UNIQUE(transactionHash, logIndex)
);

CREATE INDEX IF NOT EXISTS idx_daofactory_contract ON DAOFactoryEvents(contractAddress);
CREATE INDEX IF NOT EXISTS idx_daofactory_block ON DAOFactoryEvents(blockNumber);
CREATE INDEX IF NOT EXISTS idx_daofactory_dao ON DAOFactoryEvents(daoAddress);
CREATE INDEX IF NOT EXISTS idx_daofactory_token ON DAOFactoryEvents(tokenAddress);
```

### Environment Configuration

Create a `.env` file at the apps/apis/ directory with the following variables:

```sh
ALCHEMY_API_KEY=
```
