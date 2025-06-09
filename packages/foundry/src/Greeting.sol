// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

contract Greeting {
    string private greeting;
    address public owner;
    uint256 public totalGreetings;
    
    mapping(address => string) public userGreetings;
    mapping(address => uint256) public greetingCounts;
    
    event GreetingSet(address indexed user, string newGreeting);
    event GreetingUpdated(string oldGreeting, string newGreeting);
    
    constructor(string memory _initialGreeting) {
        greeting = _initialGreeting;
        owner = msg.sender;
        totalGreetings = 0;
    }
    
    function setGreeting(string memory _greeting) public {
        require(bytes(_greeting).length > 0, "Greeting cannot be empty");
        
        string memory oldGreeting = greeting;
        greeting = _greeting;
        userGreetings[msg.sender] = _greeting;
        greetingCounts[msg.sender]++;
        totalGreetings++;
        
        emit GreetingSet(msg.sender, _greeting);
        emit GreetingUpdated(oldGreeting, _greeting);
    }
    
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
    
    function getUserGreeting(address user) public view returns (string memory) {
        return userGreetings[user];
    }
    
    function getUserGreetingCount(address user) public view returns (uint256) {
        return greetingCounts[user];
    }
    
    function getMyGreeting() public view returns (string memory) {
        return userGreetings[msg.sender];
    }
    
    function getMyGreetingCount() public view returns (uint256) {
        return greetingCounts[msg.sender];
    }
} 