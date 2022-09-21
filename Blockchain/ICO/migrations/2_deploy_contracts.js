const NPCToken = artifacts.require("./NPCToken");

module.exports = function (deployer) {
    deployer.deploy(NPCToken, 1000000);
};
