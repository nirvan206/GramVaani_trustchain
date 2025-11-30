const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy LoanContract
  console.log("\nDeploying LoanContract...");
  const LoanContract = await hre.ethers.getContractFactory("LoanContract");
  const loanContract = await LoanContract.deploy();
  await loanContract.waitForDeployment();
  const loanContractAddress = await loanContract.getAddress();
  console.log("LoanContract deployed to:", loanContractAddress);

  // Deploy ReputationSystem
  console.log("\nDeploying ReputationSystem...");
  const ReputationSystem = await hre.ethers.getContractFactory("ReputationSystem");
  const reputationSystem = await ReputationSystem.deploy();
  await reputationSystem.waitForDeployment();
  const reputationSystemAddress = await reputationSystem.getAddress();
  console.log("ReputationSystem deployed to:", reputationSystemAddress);

  // Deploy DisputeResolution
  console.log("\nDeploying DisputeResolution...");
  const DisputeResolution = await hre.ethers.getContractFactory("DisputeResolution");
  const disputeResolution = await DisputeResolution.deploy();
  await disputeResolution.waitForDeployment();
  const disputeResolutionAddress = await disputeResolution.getAddress();
  console.log("DisputeResolution deployed to:", disputeResolutionAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      LoanContract: loanContractAddress,
      ReputationSystem: reputationSystemAddress,
      DisputeResolution: disputeResolutionAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${hre.network.name}-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentFile);

  // Save latest deployment
  const latestFile = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Latest deployment saved to:", latestFile);

  // Grant roles
  console.log("\nGranting roles...");
  
  // Grant UPDATER_ROLE to LoanContract on ReputationSystem
  const UPDATER_ROLE = await reputationSystem.UPDATER_ROLE();
  await reputationSystem.grantRole(UPDATER_ROLE, loanContractAddress);
  console.log("Granted UPDATER_ROLE to LoanContract on ReputationSystem");

  console.log("\n✅ Deployment completed successfully!");
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("LoanContract:", loanContractAddress);
  console.log("ReputationSystem:", reputationSystemAddress);
  console.log("DisputeResolution:", disputeResolutionAddress);
  console.log("\nAdd these addresses to your backend .env file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
