pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract GameToken is ERC20Mintable, ERC20Detailed {
    constructor(string name) ERC20Detailed(name, name, 0) public {}
}
