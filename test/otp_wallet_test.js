const OTPWallet = artifacts.require("OTPWallet");
const ethers = require("ethers");
var merkle = require("../lib/merkle.js");
var BN = web3.utils.BN;
const totp = require("../lib/totp.js");

// const truffleAssert = require("truffle-assertions");
var DURATION = 300;
function h16(a) { return web3.utils.soliditySha3({v: a, t: "bytes", encoding: 'hex' }).substring(0, 34); }
function h16a(a) { return web3.utils.soliditySha3(a).substring(0, 34); }
function padNumber(x) { return web3.utils.padRight(x, 32); }
function getTOTP(counter) { return totp("JBSWY3DPEHPK3PXP", {period: DURATION, counter: counter}); }

contract("OTPWallet", accounts => {
    it("should match properly", async () => {
        console.log(getTOTP(1000));

        //const leaves = [h16(padNumber('0x1')),h16(padNumber('0x2')),h16(padNumber('0x3')),h16(padNumber('0x4'))];
        var leaves = [];
        // 1year / 300 ~= 105120
        // 2^17 = 131072
        // 1609459200 is 2021-01-01 00:00:00 -- 
        // to save space, we're going to start from counter above!
        var startCounter = 1609459200 / DURATION;
        for ( var i=0; i < Math.pow(2, 17); i++) {
            leaves.push(h16(getTOTP(startCounter+i)));
        }

        const root = merkle.reduceMT(leaves);

        console.log("root="+ root);
        //console.log("leaves=", leaves);

        var currentCounter = Math.floor(((Date.now() / 1000) - 1609459200) / DURATION);
        console.log("CurrentCounter=", currentCounter);

        var proof = merkle.getProof(leaves, currentCounter, padNumber('0x3'))
        console.log(proof)
        this.testWallet = await OTPWallet.new(root, 3, DURATION);
        console.log("counter=", (await this.testWallet.getCurrentCounter()).toString());

        var receipt = await this.testWallet._reduceConfirmMaterial(proof[0], proof[1]);

        await web3.eth.sendTransaction({from: accounts[0], to: this.testWallet.address, value: web3.utils.toWei("1", "ether")});
        var tmpWallet = web3.eth.accounts.create();

        await this.testWallet.makeTransfer(tmpWallet.address, 100000000, proof[0], proof[1]);

    })

});