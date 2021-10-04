import Block from "./Block.js";
import Transaction from "./Transaction.js";

export default class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("Genesis Block", "4/10/2021", "0");
  }

  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    // in real world the block only incudes related transactions due to size limitaions
    // but here we add all of them
    let block = new Block(this.pendingTransactions, Date.now());
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("transaction must include to and from address.");
    }

    if (!transaction.isValid()){
      throw new Error("Connot add invalid transaction to chain");
    }
    this.pendingTransactions.push(transaction);
  }



  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  // check if a block is tampered or not:

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const previousBlock = this.chain[i - 1];
      const currentBlock = this.chain[i];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }
    }
    return true;
  }
}
