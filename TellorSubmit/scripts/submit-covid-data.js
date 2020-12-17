// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const axios = require("axios");
require("dotenv").config();

// Curated list of COVID-19 cases providers (public APIs)
const covidCasesEndpoints = [
  { url: 'https://api.covid19api.com/summary', jsonPath:'Global.TotalConfirmed' },
  { url: 'https://coronavirus-19-api.herokuapp.com/all', jsonPath: 'cases' },
  { url: 'https://covid-19-report-api.now.sh/api/v1/cases/brief', jsonPath: 'data.confirmed'},
]

const lookUpJsonPath = (_url) => {
  const endpoint = covidCasesEndpoints.find(({ url }) => _url === url);
  return endpoint ? endpoint.jsonPath : null;
}

async function retrieveCovidCases(useMedian = true) {
  const requests = covidCasesEndpoints.map(({ url }) => axios.get(url));
  return Promise
    .allSettled(requests)
    .then((responses) => {
      const fulfilledResponses = responses.filter(({ status }) => status === 'fulfilled');
      if (!fulfilledResponses.length) {
        console.error('Could not retrieve any value from provided endpoints');
        process.exit(1);
      }
      const casesArr = fulfilledResponses.map(({ value }) => {
        const lu = lookUpJsonPath(value.config.url);
        const nestedResolver = lu.split('.').reduce((acc, localPath) => acc[localPath], value.data);
        return nestedResolver;
      });
      // Pick a random provider.
      return casesArr[Math.floor(Math.random() * casesArr.length)];
    })
    .catch((err) => console.error(err))
}

const COVID19_DATAPOINT_ID = 2019;

async function submit() {
  const covidCasesNb = await retrieveCovidCases(false)
  console.log(`Covid19 Cases reported: ${covidCasesNb}`);

  const provider = new hre.ethers.providers.InfuraProvider("rinkeby", process.env.INFURA_PROJECT_ID)
  let wallet = new hre.ethers.Wallet(`0x${process.env.RINKEBY_SECRET_KEY}`, provider);
  
  //Submit Value to Tellor Playground
  const abi = [
      // Authenticated Functions
      "function submitValue(uint256 _requestId,uint256 _value) external",
  ] ;
  const address = "0x20374E579832859f180536A69093A126Db1c8aE9"
  const tellorPlayground = new hre.ethers.Contract(address, abi, wallet)
  await tellorPlayground.submitValue(COVID19_DATAPOINT_ID, covidCasesNb)
  console.log('Done')
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
submit()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
