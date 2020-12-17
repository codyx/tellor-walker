
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

import "usingtellor/contracts/UsingTellor.sol";
import "usingtellor/contracts/TellorPlayground.sol";

contract DataPointer is UsingTellor {
  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

  function readTellorValue(uint256 _tellorId) public view returns (uint256) {
    (bool ifRetrieve, uint256 value,) = getCurrentValue(_tellorId);
    require(ifRetrieve, "Tellor should have return a value but did not");
    return value;
  }

  function isDataBig(uint256 _id) external view returns (bool) {
    uint256 result = readTellorValue(_id);
    return result > 100;
  }
}
