pragma solidity ^0.8.0;

contract DecentralizedTwitter {
    struct Message {
        uint id;
        string text;
    }

    mapping(uint => Message) private messages;
    uint private messageCount;

    event MessagePosted(uint id, string text);

    function postMessage(string memory text) public {
        require(bytes(text).length > 0, "Message text cannot be empty.");
        messageCount++;
        messages[messageCount] = Message(messageCount, text);
        emit MessagePosted(messageCount, text);
    }

    function getMessageIds() public view returns (uint[] memory) {
        uint[] memory ids = new uint[](messageCount);
        for (uint i = 1; i <= messageCount; i++) {
            ids[i-1] = i;
        }
        return ids;
    }

    function getMessage(uint id) public view returns (Message memory) {
        require(id > 0 && id <= messageCount, "Invalid message id.");
        return messages[id];
    }
}
