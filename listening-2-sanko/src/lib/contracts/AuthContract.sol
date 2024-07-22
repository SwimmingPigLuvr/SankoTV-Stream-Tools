// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuthContract {
    mapping(address => bool) public authenticatedUsers;

    event UserAuthenticated(address users);

    function authenticate() public {
        authenticatedUsers[msg.sender] = true;
        emit UserAuthenticated(msg.sender);
    }

    function isAuthenticated(address user) public view returns (bool) {
        return authenticatedUsers[user];
    }

    modifier onlyAuthenticated() {
        require(authenticatedUsers[msg.sender], "Not authenticated");
        _;
    }




}
