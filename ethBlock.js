(function(ext) {

    let tokenAddress = '0x';
    let tokenContracts = {};
    let tokenDecimals = 0;
    let web3Client;

    // minimum ABI to of ERC20 Token
    const tokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    const tokenData = '0x60806040523480156200001157600080fd5b5060405162000cbe38038062000cbe833981016040528051018080600062000042336401000000006200008c810204565b82516200005790600490602086019062000171565b5081516200006d90600590602085019062000171565b506006805460ff191660ff929092169190911790555062000216915050565b620000a7600382640100000000620009d2620000de82021704565b604051600160a060020a038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b600160a060020a0381161515620000f457600080fd5b62000109828264010000000062000139810204565b156200011457600080fd5b600160a060020a0316600090815260209190915260409020805460ff19166001179055565b6000600160a060020a03821615156200015157600080fd5b50600160a060020a03166000908152602091909152604090205460ff1690565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001b457805160ff1916838001178555620001e4565b82800160010185558215620001e4579182015b82811115620001e4578251825591602001919060010190620001c7565b50620001f2929150620001f6565b5090565b6200021391905b80821115620001f25760008155600101620001fd565b90565b610a9880620002266000396000f3006080604052600436106100da5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100df578063095ea7b31461016957806318160ddd146101a157806323b872dd146101c8578063313ce567146101f2578063395093511461021d57806340c10f191461024157806370a082311461026557806395d89b4114610286578063983b2d561461029b57806398650275146102be578063a457c2d7146102d3578063a9059cbb146102f7578063aa271e1a1461031b578063dd62ed3e1461033c575b600080fd5b3480156100eb57600080fd5b506100f4610363565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561012e578181015183820152602001610116565b50505050905090810190601f16801561015b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561017557600080fd5b5061018d600160a060020a03600435166024356103f9565b604080519115158252519081900360200190f35b3480156101ad57600080fd5b506101b6610477565b60408051918252519081900360200190f35b3480156101d457600080fd5b5061018d600160a060020a036004358116906024351660443561047d565b3480156101fe57600080fd5b5061020761051a565b6040805160ff9092168252519081900360200190f35b34801561022957600080fd5b5061018d600160a060020a0360043516602435610523565b34801561024d57600080fd5b5061018d600160a060020a03600435166024356105d3565b34801561027157600080fd5b506101b6600160a060020a03600435166105fc565b34801561029257600080fd5b506100f4610617565b3480156102a757600080fd5b506102bc600160a060020a0360043516610678565b005b3480156102ca57600080fd5b506102bc610698565b3480156102df57600080fd5b5061018d600160a060020a03600435166024356106a3565b34801561030357600080fd5b5061018d600160a060020a03600435166024356106ee565b34801561032757600080fd5b5061018d600160a060020a03600435166106fb565b34801561034857600080fd5b506101b6600160a060020a0360043581169060243516610714565b60048054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156103ef5780601f106103c4576101008083540402835291602001916103ef565b820191906000526020600020905b8154815290600101906020018083116103d257829003601f168201915b5050505050905090565b6000600160a060020a038316151561041057600080fd5b336000818152600160209081526040808320600160a060020a03881680855290835292819020869055805186815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a350600192915050565b60025490565b600160a060020a03831660009081526001602090815260408083203384529091528120548211156104ad57600080fd5b600160a060020a03841660009081526001602090815260408083203384529091529020546104e1908363ffffffff61073f16565b600160a060020a0385166000908152600160209081526040808320338452909152902055610510848484610756565b5060019392505050565b60065460ff1690565b6000600160a060020a038316151561053a57600080fd5b336000908152600160209081526040808320600160a060020a038716845290915290205461056e908363ffffffff61084816565b336000818152600160209081526040808320600160a060020a0389168085529083529281902085905580519485525191937f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929081900390910190a350600192915050565b60006105de336106fb565b15156105e957600080fd5b6105f38383610861565b50600192915050565b600160a060020a031660009081526020819052604090205490565b60058054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156103ef5780601f106103c4576101008083540402835291602001916103ef565b610681336106fb565b151561068c57600080fd5b6106958161090b565b50565b6106a133610953565b565b6000600160a060020a03831615156106ba57600080fd5b336000908152600160209081526040808320600160a060020a038716845290915290205461056e908363ffffffff61073f16565b60006105f3338484610756565b600061070e60038363ffffffff61099b16565b92915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b6000808383111561074f57600080fd5b5050900390565b600160a060020a03831660009081526020819052604090205481111561077b57600080fd5b600160a060020a038216151561079057600080fd5b600160a060020a0383166000908152602081905260409020546107b9908263ffffffff61073f16565b600160a060020a0380851660009081526020819052604080822093909355908416815220546107ee908263ffffffff61084816565b600160a060020a038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008282018381101561085a57600080fd5b9392505050565b600160a060020a038216151561087657600080fd5b600254610889908263ffffffff61084816565b600255600160a060020a0382166000908152602081905260409020546108b5908263ffffffff61084816565b600160a060020a0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b61091c60038263ffffffff6109d216565b604051600160a060020a038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b61096460038263ffffffff610a2016565b604051600160a060020a038216907fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb6669290600090a250565b6000600160a060020a03821615156109b257600080fd5b50600160a060020a03166000908152602091909152604090205460ff1690565b600160a060020a03811615156109e757600080fd5b6109f1828261099b565b156109fb57600080fd5b600160a060020a0316600090815260209190915260409020805460ff19166001179055565b600160a060020a0381161515610a3557600080fd5b610a3f828261099b565b1515610a4a57600080fd5b600160a060020a0316600090815260209190915260409020805460ff191690555600a165627a7a7230582003af5ee2b189b2432d1b8a1e1b01ec49713d8e68b148cd4e564412027aef793c0029';

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {

        if (typeof web3 !== 'undefined') {

            if (!web3Client) {
                web3Client = new Web3(web3.currentProvider);
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

    ext.deploy = function(name, callback) {

        const description = `deploy new token contract for ${name}`;
        
        console.log(`About to ${description}`);

        const tokenContract = web3Client.eth.contract(tokenABI);

        const token = tokenContract.new(
            name,
            {
                data: tokenData,
            }, function (err, contract){
                if (err) {
                    console.error(`Failed to ${description}. Error: ${err.message}`);
                    return callback();
                }

                if (typeof contract.address !== 'undefined') {
                    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

                    tokenContracts[contract.address] = token;

                    callback(contract.address);
                }
            });
    }

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
            ['w', 'Deploy token contract for %s', 'deploy', 'name'],
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