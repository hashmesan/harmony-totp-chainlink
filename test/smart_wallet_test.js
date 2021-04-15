const SmartWallet = artifacts.require("SmartWallet");
const ethers = require("ethers");
// const truffleAssert = require("truffle-assertions");

contract("SmartWallet", accounts => {

    it("should match properly", async () => {
        this.testWallet = await SmartWallet.new();
        
        var balance = await web3.eth.getBalance(accounts[0]);
        console.log("sending ", accounts[0], this.testWallet.address, balance);
        
        await web3.eth.sendTransaction({from: accounts[0], to: this.testWallet.address, value: web3.utils.toWei("1", "ether")});

        var balance2 = await web3.eth.getBalance(this.testWallet.address);
        console.log("smartwallet balance=", balance2);

        var tmpWallet = web3.eth.accounts.create();
        await this.testWallet.submitTransfer(tmpWallet.address, 100000000, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("123456")));

        var beforeBalance = await web3.eth.getBalance(tmpWallet.address);
        await this.testWallet.totpReply(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("1")), ethers.utils.formatBytes32String("pass"));
        var afterBalance = await web3.eth.getBalance(tmpWallet.address);

        console.log(tmpWallet.address, beforeBalance, afterBalance, afterBalance-beforeBalance);
        assert.equal(afterBalance-beforeBalance, 100000000);
    })
});