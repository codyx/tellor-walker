### Tellor Walker

Easily pull data points across Tellor contracts on the Ethereum blockchain.

This is my submitted project for the [Gitcoin GR8 Hackaton](https://gitcoin.co/issue/tellor-io/usingtellor/29/100024322)

## Submit a data point to Tellor using Hardhat
```bash
cd ./TellorSubmit
npm install
```
Create a .env file and add these values (you can export your private key from Metamask testnets):
```bash
INFURA_PROJECT_ID=YOUR_INFURA_PROJECT_ID
RINKEBY_SECRET_KEY=YOUR_SECRET_KEY
GOERLI_SECRET_KEY=YOUR_SECRET_KEY
ROPSTEN_SECRET_KEY=YOUR_SECRET_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

Then run the tests
```bash
npm run test
```

As an example, I've created a script that fetches COVID19 cases and send it to the '2019' data point on Rinkeby's Tellor Playground (you can tweak it so it send whatever you need):
```
npx hardhat run scripts/submit-covid-data.js
$> Covid19 Cases reported: 74210350
Done
```

If you need to deploy your contract to Tellor Playground you can do:
```bash
npx hardhat deploy --network goerli
```

## Run Tellor Walker (frontend app) locally

First, run the development server (from root directory):
```bash
npm install
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note:
Infura has a rate limit so if the app does not seem to work, you can add your NEXT_APP_INFURA_PROJECT_ID in a .env file.

