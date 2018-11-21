(function(ext) {

    let network = 'Ropsten';
    let tokenAddress = '0x';
    let web3Client;

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
            // TODO
            console.error('Get Token balance has not been implemented');
            callback(3);
        }
        else {
            console.error(`Failed to get balance of type ${balanceType}. Type must be either Ether or Token`);
        }
    };

    ext.send = function(amount, type, toAddress, callback) {

        const description = `send ${amount} ${type} to ${toAddress}`;

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
    };

    ext.setTokenAddress = function(_tokenAddress) {
        if (!_tokenAddress || _tokenAddress == '' || _tokenAddress == '0x') {
            console.error(`Failed to set token address to "${_tokenAddress}"`)
        }
        else {
            tokenAddress = _tokenAddress;
            console.log(`Set token address to ${_tokenAddress}`)
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

    // Block and block menu descriptions
    const descriptor = {
        blocks: [
            ['R', '%m.balanceType balance of address %s', 'getBalance', 'Token', '0xF1BDa9086904aEDE7C3DA6964AA400b8e13Ea51C'],
            ['w', 'Send %s %m.balanceType to address %s', 'send', '0', 'Token', '0x'],
            [' ', 'Set token address %s', 'setTokenAddress', 'tokenAddress'],
            ['R', 'Network name', 'getNetwork'],
        ],
        menus: {
            balanceType: ['Ether', 'Token'],
            // network: ['Main net', 'Ropsten', 'Kovan', 'Rinkeby'],
        },
    };

    // Register the extension
    ScratchExtensions.register('Ether extension', descriptor, ext);
})({});