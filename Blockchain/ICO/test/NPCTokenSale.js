var npcTokenSale = artifacts.require("./NPCTokenSale.sol");

contract('NPCToken', function (accounts) {
    var tokenSaleInstance;
    var tokenPrice = 100000000000;
    it('initializes values with correct values', function () {
        return npcTokenSale.deployed().then(function (token) {
            tokenSaleInstance = token;
            return tokenSaleInstance.address
        }).then(function (address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function (address) {
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function (price) {
            assert.equal(price, tokenPrice, "token price is correct");
        });
    });
});


