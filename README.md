# Lottery SmartContract

## This is a simple lottery smart contract where users can participate by sending entry fee to the contract. and then once there are enough participants, the owner will lock the contract and no new entries can be made and then owner will randomly select a winner from the participants. 10% of the amount the owner will keep and rest will be given to the winner.

Try running some of the following tasks:

```shell
npx hardhat test .\test\lotteryTest.js  (to run the test cases written)
npx hardhat run .\scripts\deploy.js --network goerli (to deploy the contract on testnet/main net)

make sure to create a '.env' file and put following 2 value: -
NODE_URL=<Node url> (could be alchemy or moralis etc)
PRIVATE_KEY=<metamask wallet private key>
```
