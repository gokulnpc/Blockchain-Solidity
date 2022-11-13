const ShareMsg = artifacts.require("ShareMsg.sol");

module.exports = function (deployer) {
    deployer.deploy(ShareMsg);
};
