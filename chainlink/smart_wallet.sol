pragma solidity 0.4.24;

contract SmartWallet {
    bool public finalize = false;
    bytes32 receipt;
    event WalletTransfer(address to, uint amount);
    event WalletTotpMismatch(bytes32 totp);
    event Deposit(address indexed sender, uint value);

    struct Op {
        address to;
        uint amount;
        bytes32 totp;
    }
    
    mapping(bytes32 => Op) public opBuffer;
    
     constructor() public {
     }
     
     function finalize(bytes32 receipt_) external {
         receipt = receipt_;
         finalize = true;
     }
     
     function submitTransfer(address to, uint amount, bytes32 totp) public {
         // fire off totp check
         
         require(address(this).balance >= amount);
         opBuffer[keccak256("1")] = Op(to, amount, totp);
     }
     
     function totpReply(bytes32 _requestId, bytes32 receipt) public {
        string memory receiptStr = bytes32ToString(receipt);
         Op op = opBuffer[_requestId];
         
         require(op.amount > 0);

         if (keccak256(abi.encodePacked(receiptStr)) == keccak256(abi.encodePacked("pass"))) {
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

    /// @dev Fallback function allows to deposit ether.
    function()
        payable
    {
        if (msg.value > 0)
            Deposit(msg.sender, msg.value);
    }

}