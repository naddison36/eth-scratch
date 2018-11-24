# ScratchX Experimental Extensions

A ScratchX extensions for connecting to the Ethereum blockchain and ERC20 token contracts.

## Ethereum Extension Block

The JavaScript code for the Ethereum extension is in [ethBlock.js](./ethBlock.js). This can be loaded into SctatchX in two was
1. From a local file

Clone this repository to your local machine using
```
git clone https://github.com/naddison36/eth-scratch.git
cd eth-scratch
```

Open the [ScratchX Editor](https://scratchx.org/#scratch) (you will have to allow the Flash plug-in), select the `Scripts` tab and then select `More Blocks`. Then hold the `control` button on the keyboard and click the `Load Experiental Extension` button.

2. From the web

In theory you can load from an external [url](http://scratchx.org/?https://naddison36.github.io/eth-scratch/ethBlock.js) but I haven't gotten that to work.

## Useful links
* [ScratchX Documentation](https://github.com/LLK/scratchx/wiki#introduction)
* [ScratchX Editor](http://scratchx.org/#scratch)
* [GitHub Pages](https://naddison36.github.io/eth-scratch) site for these extensions 

## Cross-Site Scripting
In order to get around the browser's [cross-site scripting](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) rules, ScratchX blocks can be loaded from GitHub Pages with a [crossdomain.xml](./crossdomain.xml) file in the GitHub user's repository, not this project repository. eg [naddison36/naddison36.github.io](https://naddison36/naddison36.github.io/crossdomain.xml). See [Setting up crossdomain.xml](https://github.com/LLK/scratchx/wiki#setting-up-crossdomainxml) for more details.

## Token Contracts

A simple ERC20 contract to test the integration between the Scratch extension and a token contract is [/contracts/GameToken.sol](./contracts/GameToken.sol).

This contract is dependent on the [Open Zeppelin](https://openzeppelin.org/) smart contract library. Run the following to install the Open Zeppelin
```
npm install openzeppelin-solidity
```

The easiest way to compile and deploy the test token contract to a test network like Ropsten is using [Remix](https://remix.ethereum.org/). In order to be able to load all the dependent Open Zeppelin contracts in remix, [remixd](https://github.com/ethereum/remixd#remixd) can be used to connect remix running in the broswe to the local filesystem where the GaemToken and dependent Open Zeppelin files are found. To install and run remixd

```
npm install -g remixd

remixd -s <your full path>/eth-scratch  --remix-ide https://remix.ethereum.org
```

See [Access your local filesystem by using RemixD](https://remix.readthedocs.io/en/latest/tutorial_remixd_filesystem.html#access-your-local-filesystem-by-using-remixd) for more details.

In order to connect Remix to [MetaMask](https://metamask.io/), the `Enable Personal Mode` setting in Remix needs to be disabled.

Your Ropsten account will need some Ether in order to deploy the contract and send transactions. The [MetaMask Ether Faucet](https://faucet.metamask.io) can be used to get Ropsten Ether.
