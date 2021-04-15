pragma solidity 0.4.24;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";
import "./wallet.sol";

contract WalletFactory is ChainlinkClient {
  
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    mapping(bytes32 => address) public wallets;
    event WalletFinalized(address childAddress, string receipt);

    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xA4789B64a906983F5C9e40fFbe0E569b913862A1;
        jobId = "782d0b5b71cf4f1fb0b5c4cf88c7d1be";
        fee = 0.2 * 10 ** 18; // 0.1 LINK
    }
    
    function createWallet(string receipt) public {
       SmartWallet child = new SmartWallet();
       wallets[keccak256(bytes(receipt))] = address(child);
       requestWalletLink(receipt, address(child));
    }
    
    function requestWalletLink(string receipt, address wallet) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        request.add("post", "https://xgokv6tzka.execute-api.us-east-1.amazonaws.com/default/2fa-store");
        request.add("operation", "finalize");
        request.add("receipt", receipt);
        request.add("wallet", toString(abi.encodePacked(wallet)));
        
        request.add("path", "data.receipt");
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, bytes32 receipt) public recordChainlinkFulfillment(_requestId)
    {
        string memory receiptStr = bytes32ToString(receipt);
        address walletAddr = wallets[keccak256(receiptStr)];
        if (walletAddr != address(0)) {
            SmartWallet(walletAddr).finalize(keccak256(receiptStr));
            emit WalletFinalized(walletAddr, receiptStr);
        }
    }
    
    function toString(bytes memory data) public pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";
    
        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function bytes32ToString(bytes32 x) internal pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    
}

