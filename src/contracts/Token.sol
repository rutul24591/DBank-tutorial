// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable
  address public minter;
  
  //add minter changed event
  event MinterChanged(address indexed from, address to);

  constructor() payable ERC20("Decentralized Bank Currency", "DBC") {
    //assign initial minter
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address dbank) public returns (bool) {
    // If require condition does not satisfy it will exit the function showing custom error message provided
    require(msg.sender == minter, 'ERROR, Only owner can change pass minter role');
    minter = dbank;

    emit MinterChanged(msg.sender, dbank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, 'ERROR, msg.sender does not have minter role');
		_mint(account, amount); 
	}
}