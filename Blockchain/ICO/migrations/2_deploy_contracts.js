var NPCToken = artifacts.require("./NPCToken.sol");
var NPCTokenSale = artifacts.require("./NPCTokenSale.sol");

//this is invoked by admin
module.exports = function (deployer) {
    deployer.deploy(NPCToken, 1000000).then(function () {
        // Token price is 0.001 Ether
        var tokenPrice = 1000000000000000;
        return deployer.deploy(NPCTokenSale, NPCToken.address, tokenPrice);
    });
};