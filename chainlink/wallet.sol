pragma solidity 0.4.24;
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";

contract SmartWallet is ChainlinkClient {
    bool public finalize = false;
    bytes32 receipt;
    event WalletTransfer(address to, uint amount);
    event WalletTotpMismatch(string totp);
    event Deposit(address indexed sender, uint value);

    struct Op {
        address to;
        uint amount;
        string totp;
    }
    
    mapping(bytes32 => Op) public opBuffer;
    
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xA4789B64a906983F5C9e40fFbe0E569b913862A1;
        jobId = "782d0b5b71cf4f1fb0b5c4cf88c7d1be";
        fee = 0.2 * 10 ** 18; // 0.1 LINK
    }

     
     function finalize(bytes32 receipt_) external {
         receipt = receipt_;
         finalize = true;
     }
     
     function submitTransfer(address to, uint amount, string totp) public {
         // fire off totp check
         
         require(address(this).balance >= amount);
         bytes32 requestId = requestWalletVerify(totp);
         opBuffer[requestId] = Op(to, amount, totp);
     }

    function requestWalletVerify(string totp) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.totpReply.selector);
        
        request.add("post", "https://xgokv6tzka.execute-api.us-east-1.amazonaws.com/default/2fa-store");
        request.add("operation", "verify");
        request.add("code", totp);
        request.add("wallet", toString(abi.encodePacked(address(this))));

        request.add("path", "data.result");
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
         
     function totpReply(bytes32 _requestId, bytes32 result) public {
        string memory resultStr = bytes32ToString(result);
         Op memory op = opBuffer[_requestId];
         
         require(op.amount > 0);

         if (keccak256(abi.encodePacked(resultStr)) == keccak256(abi.encodePacked("pass"))) {
             op.to.transfer(op.amount);
             emit WalletTransfer(op.to, op.amount);
         } else {
             emit WalletTotpMismatch(op.totp);
         }
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
    
    /// @dev Fallback function allows to deposit ether.
    function()
        public payable
    {
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }

}