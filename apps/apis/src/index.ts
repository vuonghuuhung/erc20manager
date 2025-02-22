import { ERC20Factory__factory } from "contracts";
import { getDefaultProvider } from "ethers";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

const provider = getDefaultProvider("http://127.0.0.1:8545/");
const erc20Factory = ERC20Factory__factory.connect(
  "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  provider
);

const filterTest =
  erc20Factory.filters["ERC20Factory__Create(address,address,uint256)"];
erc20Factory.on(filterTest, (owner, token, amount) => {
  console.log("receive events", {
    owner,
    token,
    amount,
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/list", async (req: Request, res: Response) => {
  const list = await erc20Factory.getListOfERC20ManagerCreated();
  res.status(200).json(list);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(0);
});
