const FactoryStore = artifacts.require("FactoryStore");

contract("FactoryStore", accounts => {

    it("should match properly", async () => {
        this.testContract = await FactoryStore.new("a8d6d420-98a1-11eb-910d-99fee937");
        await this.testContract.fulfill("0x61386436643432302d393861312d313165622d393130642d3939666565393337")      
    })
});