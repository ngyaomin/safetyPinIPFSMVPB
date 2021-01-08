const SafetyPinFile = artifacts.require("SafetyPinFile");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SafetyPinFile,{from: accounts[0]});
};
