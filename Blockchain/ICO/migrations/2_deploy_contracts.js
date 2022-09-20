const NPCToken = artifacts.require("NPCToken");

module.exports = function (deployer) {
    deployer.deploy(NPCToken);
};
