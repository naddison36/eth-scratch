# ScratchX Ethereum Extension Block

A ScratchX extension for connecting to the Ethereum blockchain and ERC20 token contracts.

## Scratch X

[Scratch](https://scratch.mit.edu/) does not support loading custom extensions so the [ScratchX Editor](http://scratchx.org/#scratch) is used instead.

## Loading the extension

The JavaScript code for the Ethereum extension is in [ethBlock.js](./ethBlock.js). This can be loaded into SctatchX in two ways:
1. From a local file

Clone this repository to your local machine using
```
git clone https://github.com/naddison36/eth-scratch.git
cd eth-scratch
```

Open the [ScratchX Editor](https://scratchx.org/#scratch) (you will have to allow the Flash plug-in), select the `Scripts` tab and then select `More Blocks`. Then hold the `control` button on the keyboard and click the `Load Experimental Extension` button.

2. From the web

In theory, you can load from an external [url](http://scratchx.org/?https://naddison36.github.io/eth-scratch/ethBlock.js) but I haven't gotten that to work.

## Usage

Once loaded, the extension has a number of report and command blocks to get data from the Ethereum blockchain or send signed transaction via a browser wallet like [MetaMask](https://metamask.io/).

![ScratchX Blocks](./ScratchXBlocks.png)

The command blocks should pop up a browser wallet to sign the transaction and send them onto the Ethereum network. Here's an example for signing a token transfer using MetaMask. The transaction from address, gas price and gas limit are all set in the browser wallet.

![MetaMask Transfer](./MetaMaskTransfer.png)

All the addresses need to be prefixed with `0x`.

| Block | Notes |
|---|---|
| ether balance of address %s | gets the ether balance of an address which can be an externally owned account or a contract |
| send %s ether to address %s | sends a number of ether to an address |
| transfer %s tokens to address %s of contract address %s | assumes a contract with an ERC20 `transfer` function exists at the contract address | 
| transfer from address %s to address %s %s tokens for contract %s | assumes a contract with an ERC20 `transferFrom` function exists at the contract address |
| approve address %s to spend %s tokens for contract %s | assumes a contract with an ERC20 `approve` function exists at the contract address |
| mint %s tokens to address %s for contract %s | assumes a contract with an Open Zeppelin [mint](https://openzeppelin.org/api/docs/token_ERC20_MintableToken.html#mint) function exists at the contract address. |
| deploy token contract for %s | The name parameter is used to set both the token symbol and name |
| token balance of address %s for contract %s | assumes a contract with an ERC20 `balanceOf` function exists at the contract address |
| allowance of owner address %s to spender address %s | assumes a contract with an ERC20 `allowance` function exists at the contract address |
| token %m of token contract %s | get the `name`, `symbol` or `decimals` properties of the deployed contract |
| network name | returns the name of the network the browser wallet it connected to. This is useful for testing connectivity. |
| when transaction on contract %s | Not currently implemented |

## Error handling

There is no error handling with ScratchX extensions so the best that can be done is logging errors in the browser's JavaScript console. 

# Ethereum

[Ethereum](https://www.ethereum.org/) is a decentralized platform for applications that run exactly as programmed without any chance of fraud, censorship or third-party interference.

## Token Contract

 [GameToken](./contracts/GameToken.sol) is an ERC20 compliant, token contract to test the integration between the Scratch extension and a token contract. Note the constructor only takes one string parameter which is used to set the `symbol` and `name` properties of the contract.

The deploy block command will deploy the [GameToken](./contracts/GameToken.sol) contract that was compiled using Solidity 0.4.25 (0.4.25+commit.59dbf8f1.Emscripten.clang) with optimization enabled.

## Using Remix

[Remix](https://remix.ethereum.org/) is the easiest way to compile, deploy and interact with Ethereum smart contracts.

The [GameToken](./contracts/GameToken.sol) contract is dependent on the [Open Zeppelin](https://openzeppelin.org/) smart contract library. Run the following to install the Open Zeppelin
```
npm install openzeppelin-solidity
```

In order to be able to load all the dependent Open Zeppelin contracts in Remix, [remixd](https://github.com/ethereum/remixd#remixd) can be used to connect Remix running in the browser to the local filesystem where the GameToken and dependent Open Zeppelin files are found. To install and run remixd

```
npm install -g remixd

remixd -s <your full path>/eth-scratch --remix-ide https://remix.ethereum.org
```

See [Access your local filesystem by using RemixD](https://remix.readthedocs.io/en/latest/tutorial_remixd_filesystem.html#access-your-local-filesystem-by-using-remixd) for more details.

In order to connect Remix to [MetaMask](https://metamask.io/), the `Enable Personal Mode` setting in Remix needs to be disabled.

## Ether

Your Ethereum account will need some Ether in order to deploy the GameToken contract and send transactions. The [MetaMask Ether Faucet](https://faucet.metamask.io) can be used to get Ether for the public test networks like Ropsten. For mainnet, you'll have to purchase Ether from a broker or exchange.

## Scratch 3.0

[Scratch 3.0](https://scratch.mit.edu/3faq) will be released on 2 January 2019. The update from Scratch 2.0 to 3.0 includes extensions so the old ScratchX site will be unsupported. Once Scratch 3.0 has been released, this ScratchX extension will be upgraded to Scratch 3.0. See [With the upcoming Scratch 3.0, the extension structure has been completely revamped](https://scratch.mit.edu/discuss/topic/277217/?page=1) for a preview of the changes. Also see [Scratch 3.0 Extensions Specification
](https://github.com/LLK/scratch-vm/wiki/Scratch-3.0-Extensions-Specification) on their GitHub wiki.

# Useful links
* [ScratchX Editor](http://scratchx.org/#scratch)
* [ScratchX Documentation](https://github.com/LLK/scratchx/wiki#introduction)
* [Scratch for developers](https://scratch.mit.edu/developers)
* [Scratch 3.0](https://scratch.mit.edu/3faq)
* [Google's Blockly](https://developers.google.com/blockly/)