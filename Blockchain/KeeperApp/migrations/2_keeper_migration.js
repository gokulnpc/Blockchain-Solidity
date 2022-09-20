const Keeper = artifacts.require("./Keeper.sol");

module.exports = function (deployer) {
    deployer.deploy(Keeper);
};
