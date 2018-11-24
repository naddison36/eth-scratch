(function(ext) {

    let network = 'Ropsten';
    let tokenAddress = '0x';
    let tokenContract;
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
     * Gets the Token or Ether balance for an address
     * @param balanceType either 'Token' or 'Ether'
     * @param address can be an externally owned account or smart contract
     */
    ext.getBalance = function(balanceType, address, callback) {

        const description = `get ${balanceType} balance of address ${address}`;

        console.log(`About to ${description}`);

        if (balanceType === 'Ether') {
            web3.eth.getBalance(address, (err, balance) => {
                if (err) {
                    return console.error(`Failed to ${description}. Error: ${err}`);
                }

                const convertedBalance = web3.fromWei(balance, 'ether').toString(10);
                console.log(`Got balance ${convertedBalance} ether (${balance.toString()} wei) for ${description}.`);

                callback(convertedBalance);
            })
        }
        else if (balanceType === 'Token') {
            getTokenBalance(address, callback);
        }
        else {
            console.error(`Failed to get balance of type ${balanceType}. Type must be either Ether or Token`);
        }
    };

    function getTokenBalance(walletAddress, callback) {

        const description = `token balance of wallet address ${walletAddress} for token contract ${tokenAddress}`;

        console.log(`About to get ${description}`);

        // Call balanceOf function
        tokenContract.balanceOf(walletAddress, (err, balance) => {

            if(err) {
                const error = new Error(`Failed to get ${description}. Error: ${err.message}`);
                console.error(error.message);
                return callback(error);
            }

            // calculate a balance = 10 ^ decimals
            balance = balance.div(10 ** tokenDecimals).toString();

            console.log(`Got ${balance} ${description}`);

            callback(balance);
        });
    }

    ext.trasnfer = function(amount, type, toAddress, callback) {

        const description = `transfer ${amount} ${type}s to ${toAddress}`;

        console.log(`About to ${description}`);

        if (type === 'Ether') {

            web3Client.eth.sendTransaction({
                from: web3.eth.coinbase,
                to: toAddress,
                value: web3.toWei(amount, 'ether'),
            }, (err, transactionHash) => {
                if (err) {
                    console.error(`Failed to ${description}. Error: ${err}`);
                }
                
                callback(null, transactionHash);
            })
        }
        else if (type == 'Token') {
            tokenContract.transfer(toAddress, amount, (error, transactionHash) => {
                
                console.log(`Got ${transactionHash} for ${description}`);

                callback(null, transactionHash);
              });
        }
        else {
            console.error(`Failed to ${description}. Type must be either Ether or Token`);
        }
    };

    ext.trasnferFrom = function(fromAddress, toAddress, amount, callback) {

        const description = `transfer from address ${fromAddress} to ${toAddress} ${amount} tokens`;

        console.log(`About to ${description}`);

        tokenContract.transferFrom(fromAddress, toAddress, amount, (error, transactionHash) => {
            
            console.log(`Got ${transactionHash} for ${description}`);

            callback(null, transactionHash);
        });
    };

    ext.approve = function(spender, amount, callback) {

        const description = `approve address ${spender} to spend ${amount} tokens`;

        console.log(`About to ${description}`);

        tokenContract.approve(spender, amount, (error, transactionHash) => {
            
            console.log(`Got ${transactionHash} for ${description}`);

            callback(null, transactionHash);
        });
    };

    ext.mint = function(amount, toAddress, callback) {

        const description = `mint ${amount} tokens to account ${toAddress}`;

        console.log(`About to ${description}`);

        tokenContract.mint(spender, amount, (error, transactionHash) => {
            
            console.log(`Got ${transactionHash} for ${description}`);

            callback(null, transactionHash);
        });
    };

    ext.setTokenAddress = function(_tokenAddress) {
        if (!_tokenAddress || _tokenAddress == '' || _tokenAddress == '0x') {
            console.error(`Failed to set token address to "${_tokenAddress}"`)
        }
        else {
            tokenAddress = _tokenAddress;
            console.log(`Set token address to ${_tokenAddress}`);

            // Get ERC20 Token contract instance
            tokenContract = web3Client.eth.contract(tokenABI).at(tokenAddress);

            // TODO Get decimals
            // tokenContract.decimals((error, decimals) => {
            //     // calculate a balance
            //     balance = balance.div(10**decimals).toString();
            //     console.log(balance);

            //     callback(null, balance);
            // });
        }
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

    ext.whenContractTransaction = function(contractAddress) {
        
        const description = `watch for transactions against contract ${contractAddress}`;

        const filter = web3.eth.filter({
            address: contractAddress
        });

        console.log(`About to ${description}`)

        filter.watch(function(err, result){
            if (error) {
              console.error(`Failed to ${description}. Error ${error}`);
            }

            return true;
        });

        return false;
    };

    // Block and block menu descriptions
    const descriptor = {
        blocks: [
            ['R', '%m.balanceType balance of address %s', 'getBalance', 'Token', '0xF1BDa9086904aEDE7C3DA6964AA400b8e13Ea51C'],
            ['w', 'Transfer %s %m.balanceType to address %s', 'transfer', '0', 'Token', '0x'],
            ['w', 'Transfer from address %s to address %s %s tokens', 'transferFrom', '0x', '0x', 0],
            ['w', 'Approve address %s to spend %s tokens', 'approve', '0x', 0],
            ['w', 'Mint %s tokens to address %s', 'mint', 0, '0x'],
            [' ', 'Set token address %s', 'setTokenAddress', 'tokenAddress'],
            ['R', 'Network name', 'getNetwork'],
            ['h', 'when transaction on contract %s', 'whenContractTransaction', '0x']
        ],
        menus: {
            balanceType: ['Ether', 'Token'],
            // network: ['Main net', 'Ropsten', 'Kovan', 'Rinkeby'],
        },
    };

    // Register the extension
    ScratchExtensions.register('Ether extension', descriptor, ext);
})({});