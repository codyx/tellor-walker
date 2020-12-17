const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploy contract with Tellor's playground master address")
  .setAction(async (taskArgs) => {
    const playgroundAddress = taskArgs.masterAddress || "0x20374E579832859f180536A69093A126Db1c8aE9";
    const DataPointer = await hre.ethers.getContractFactory("DataPointer");
    const dataPointer = await DataPointer.deploy(playgroundAddress);
  
    await dataPointer.deployed();
  
    console.log("dataPointer deployed to:", dataPointer.address);
    console.log("dataPointer hash:", dataPointer.deployTransaction.hash);
    await dataPointer.deployTransaction.wait(3);
    console.log('dataPointer finished waiting');
  
    console.log('submitting for etherscan verification...');
      await run(
        "verify", {
        address: dataPointer.address,
        constructorArguments: [playgroundAddress],
      },
      )
    console.log('dataPointer done')
  });


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.RINKEBY_SECRET_KEY}`]
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.GOERLI_SECRET_KEY}`]
    },
    ropsten: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.ROPSTEN_SECRET_KEY}`]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.RINKEBY_SECRET_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  // solidity: "0.7.3",
  // solidity: "0.5.16",
  solidity: "0.7.0",
};
