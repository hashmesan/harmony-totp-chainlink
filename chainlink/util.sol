pragma solidity 0.4.24;

contract FactoryStore {
    mapping(bytes32 => address) public wallets;
    event WalletFinalized(address childAddress, string receipt);

    constructor(string receipt) public {
        wallets[keccak256(bytes(receipt))] = address(this);
    }

    function fulfill(bytes32 receipt) public {
        string memory receiptStr = bytes32ToString(receipt);
        WalletFinalized(address(0), receiptStr);
        
        address walletAddr = wallets[keccak256(receiptStr)];
        if (walletAddr != address(0)) {
            //Child(walletAddr).finalize();
            emit WalletFinalized(walletAddr, receiptStr);
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
    
}