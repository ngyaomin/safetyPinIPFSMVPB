const SafetyPinFile = artifacts.require("SafetyPinFile");

module.exports = function(deployer) {
  deployer.deploy(SafetyPinFile);
};
