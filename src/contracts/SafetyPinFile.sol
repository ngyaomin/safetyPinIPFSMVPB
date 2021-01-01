// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract SafetyPinFile {
  string safetyPinHash;
  function set(string memory _safetyPinHash) public {
    safetyPinHash = _safetyPinHash;
  }

  function get()public view returns (string memory) {
    return safetyPinHash;
  }
}
