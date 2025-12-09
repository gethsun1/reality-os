// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FranchiseToken
/// @notice Simple ERC20 used for franchise staking and governance weight.
contract FranchiseToken is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, address owner_, uint256 initialSupply)
        ERC20(name_, symbol_)
    {
        _transferOwnership(owner_);
        if (initialSupply > 0) {
            _mint(owner_, initialSupply);
        }
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

