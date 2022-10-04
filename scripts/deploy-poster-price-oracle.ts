import hre, { ethers } from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { verifyContract } from "./common/verify-contract";

const outputFilePath = `./deployments/${hre.network.name}.json`;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const deployments = JSON.parse(readFileSync(outputFilePath, "utf-8"));

  const PriceOraclePPR = await ethers.getContractFactory("PriceOraclePPR");
  const oracle = await PriceOraclePPR.deploy(deployments.Unitroller);
  await oracle.deployed();
  console.log("PriceOraclePPR deployed to:", oracle.address);

  deployments.PriceOraclePPR = oracle.address;
  writeFileSync(outputFilePath, JSON.stringify(deployments, null, 2));

  await oracle.deployTransaction.wait(15);
  await verifyContract(oracle.address, [deployer.address]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
