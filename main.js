// 1. create a transaction and compute its hash and add it to chain
// 2. add proof of work to prevent to tamper with chain
// 3. mining rewards
// 4. trasactions will signed with keys

import Blockchain from "./Blockchain.js";
import Transaction from "./Transaction.js";
import EC from "elliptic";
const ec = new EC.ec("secp256k1");

const myKey = ec.keyFromPrivate(
  "5d592bc20d88900a7fd0ac820038f995ef9658103e1cb7905c0ce4a156f2e5aa"
);
const myWalletAddress = myKey.getPublic("hex");

let arashCoin = new Blockchain();
const tx1 = new Transaction(myWalletAddress, "to here", 10);
tx1.signTransaction(myKey);
arashCoin.addTransaction(tx1);

console.log("Start mining...");
arashCoin.minePendingTransactions(myWalletAddress);

console.log(
  "Balance of Arash is:",
  arashCoin.getBalanceOfAddress(myWalletAddress)
);

