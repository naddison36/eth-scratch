(function(ext) {

    let tokenAddress = '0x';
    let tokenContract;
    let tokenContracts = {};
    let tokenDecimals = 0;
    let web3Client;

    // minimum ABI to of ERC20 Token
    const tokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {

        if (typeof web3 !== 'undefined') {

            if (!web3Client) {
                web3Client = new Web3(web3.currentProvider);

                token = web3.eth.accounts[0];
            }

            return {status: 2, msg: 'Ready'};
         } 
         else{
            return {status: 1, msg: 'MetaMask is not installed'};
         }
    };

    /**
     * Gets the Ether balance for an address
     * @param address can be an externally owned account or smart contract
     */
    ext.getEtherBalance = function(address, callback) {

        const description = `get Ether balance of address ${address}`;

        console.log(`About to ${description}`);

        web3.eth.getBalance(address, (err, balance) => {
            if (err) {
                console.error(`Failed to ${description}. Error: ${err}`);
                return callback();
            }

            const convertedBalance = web3.fromWei(balance, 'ether').toString(10);
            console.log(`Got balance ${convertedBalance} ether (${balance.toString()} wei) for ${description}.`);

            callback(convertedBalance);
        });
    };

    ext.sendEther = function(amount, toAddress, callback) {

        const description = `send ${amount} Ether to ${toAddress}`;

        console.log(`About to ${description}`);

        web3Client.eth.sendTransaction({
            from: web3.eth.coinbase,
            to: toAddress,
            value: web3.toWei(amount, 'ether'),
        }, (err, transactionHash) => {
            if (err) {
                console.error(`Failed to ${description}. Error: ${err}`);
                return callback();
            }
            
            callback(transactionHash);
        })
    };

    ext.getContract = function(tokenAddress) {

        if (tokenContracts[tokenAddress]) {
            return tokenContracts[tokenAddress];
        }
        else {
            console.log(`Creating contract instance for address ${tokenAddress}`);

            // Get ERC20 Token contract instance
            tokenContracts[tokenAddress] = web3Client.eth.contract(tokenABI).at(tokenAddress);

            return tokenContracts[tokenAddress];
        }
    }

    ext.getTokenBalance = function(walletAddress, tokenAddress, callback) {

        const description = `token balance of wallet address ${walletAddress} for token contract ${tokenAddress} with ${tokenDecimals} decimals`;

        console.log(`About to get ${description}`);

        const tokenContract = ext.getContract(tokenAddress);

        // Call balanceOf function
        tokenContract.balanceOf(walletAddress, (err, balance) => {

            if(err) {
                console.error(`Failed to get ${description}. Error: ${err.message}`);
                return callback();
            }

            // calculate a balance = 10 ^ decimals
            balance = balance.div(10 ** tokenDecimals).toString();

            console.log(`Got ${balance} ${description}`);

            callback(balance);
        });
    }

    ext.transfer = function(amount, toAddress, tokenAddress, callback) {

        const description = `transfer ${amount} tokens to ${toAddress} of token contract ${tokenAddress}`;

        console.log(`About to ${description}`);

        const tokenContract = ext.getContract(tokenAddress);

        tokenContract.transfer(toAddress, amount, (err, transactionHash) => {

            if (err) {
                console.error(`Failed to ${description}. Error ${err}`);
                return callback();
            }
            
            console.log(`Got ${transactionHash} for ${description}`);

            callback(transactionHash);
        });
    };

    ext.transferFrom = function(fromAddress, toAddress, amount, tokenAddress, callback) {

        const description = `transfer from address ${fromAddress} to ${toAddress} ${amount} tokens of token contract ${tokenAddress}`;

        console.log(`About to ${description}`);

        const tokenContract = ext.getContract(tokenAddress);

        tokenContract.transferFrom(fromAddress, toAddress, amount, (err, transactionHash) => {

            if (err) {
                console.error(`Failed to ${description}. Error ${err}`);
                return callback();
            }
            
            console.log(`Got ${transactionHash} for ${description}`);

            callback(transactionHash);
        });
    };

    ext.approve = function(spender, amount, tokenAddress, callback) {

        const description = `approve address ${spender} to spend ${amount} tokens of token contract ${tokenAddress}`;

        console.log(`About to ${description}`);

        const tokenContract = ext.getContract(tokenAddress);

        tokenContract.approve(spender, amount, (err, transactionHash) => {

            if (err) {
                console.error(`Failed to ${description}. Error ${err}`);
                return callback();
            }
            
            console.log(`Got ${transactionHash} for ${description}`);

            callback(transactionHash);
        });
    };

    ext.mint = function(amount, toAddress, tokenAddress, callback) {

        const description = `mint ${amount} tokens to account ${toAddress} of token contract ${tokenAddress}`;
        
        console.log(`About to ${description}`);

        const tokenContract = ext.getContract(tokenAddress);

        tokenContract.mint(toAddress, amount, (err, transactionHash) => {
            
            if (err) {
                console.error(`Failed to ${description}. Error ${err}`);
                return callback();
            }

            console.log(`Got ${transactionHash} for ${description}`);

            callback(transactionHash);
        });
    };

    ext.whenContractTransaction = function(contractAddress) {
        
        const description = `watch for transactions against contract ${contractAddress}`;

        // const filter = web3.eth.filter({
        //     address: contractAddress
        // });

        // console.log(`About to ${description}`)

        // filter.watch(function(err, result){
        //     if (error) {
        //       console.error(`Failed to ${description}. Error ${error}`);
        //     }

        //     return true;
        // });

        return false;
    };

    ext.getTokenProperty = function(tokenProperty, tokenAddress, callback) {

        const description = `${tokenProperty} for token contract ${tokenAddress}`;
        
        console.log(`About to get ${description}`);

        const tokenContract = ext.getContract(tokenAddress);

        tokenContract[tokenProperty]((err, propertyValue) => {
            
            if (err) {
                console.error(`Failed to get ${description}. Error ${err}`);
                return callback();
            }

            console.log(`Got ${propertyValue} ${description}`);

            if (tokenProperty === 'decimals') {
                tokenDecimals = propertyValue;
            }

            callback(propertyValue.toString());
        });
    };

    ext.getNetwork = function(callback) {
        web3.version.getNetwork((err, netId) => {
            switch (netId) {
              case "1":
                return callback('Mainnet')
              case "2":
                return callback('Morden')
              case "3":
                return callback('Ropsten')
              case "4":
                return callback('Rinkeby')
              case "42":
                return callback('Kovan')
              default:
                return callback('Unknown')
            }
        })
    };

    // Block and block menu descriptions
    const descriptor = {
        blocks: [
            ['R', 'Ether balance of address %s', 'getEtherBalance', '0x'],
            ['w', 'Transfer %s Ether to address %s', 'sendEther', '0', '0x'],
            ['w', 'Transfer %s tokens to address %s of contract address %s', 'transfer', '0', '0x', '0x'],
            ['w', 'Transfer from address %s to address %s %s tokens for contract %s', 'transferFrom', '0x', '0x', 0, '0x'],
            ['w', 'Approve address %s to spend %s tokens for contract %s', 'approve', '0x', 0, '0x'],
            ['w', 'Mint %s tokens to address %s for contract %s', 'mint', 0, '0x', '0x'],
            ['R', 'balance of token address %s for contract %s', 'getTokenBalance', '0x', '0x'],
            ['R', 'Token %m.tokenProperties of token contract %s', 'getTokenProperty', 'name', '0x'],
            ['R', 'Network name', 'getNetwork'],
            ['h', 'when transaction on contract %s', 'whenContractTransaction', '0x']
        ],
        menus: {
            tokenProperties: ['decimals', 'symbol', 'name']
        },
    };

    // Register the extension
    ScratchExtensions.register('Ether extension', descriptor, ext);
})({});