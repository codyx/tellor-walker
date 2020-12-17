const { expect } = require("chai");

describe("Greeter", function() {
  it("Should return the new greeting once it's changed", async function() {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    
    await greeter.deployed();
    expect(await greeter.greet()).to.equal("Hello, world!");

    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("Tellor Playground: DataPointer", () => {
  let playground;
  let dataPointer;

  beforeEach("Setup contract", async () => {
    const DataPointer = await ethers.getContractFactory("DataPointer");
    const PlayGround = await ethers.getContractFactory("TellorPlayground");
    playground = await PlayGround.deploy();
    await playground.deployed();
    dataPointer = await DataPointer.deploy(playground.address);
    await dataPointer.deployed();
  });

  it("Should set and return 42 as Tellor value for id 1", async () => {
    await playground.submitValue(1, 42);
    const r = await dataPointer.readTellorValue(1);
    expect(r.toString()).to.equal("42"); // ETHUSD > 100
  });

  it("Should pass isDataBig test", async () => {
    await playground.submitValue(1, 88);  // small
    await playground.submitValue(2, 888); // big
    expect(await dataPointer.isDataBig(1)).to.be.false;
    expect(await dataPointer.isDataBig(2)).to.be.true;
  });
})