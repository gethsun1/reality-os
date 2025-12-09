import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  const baseURI = process.env.BASE_URI || 'ipfs://reality/';
  const initialFranchiseSupply = BigInt(process.env.FRANCHISE_INITIAL_SUPPLY || '1000000');

  console.log('Deployer:', deployer.address);

  const FranchiseToken = await ethers.getContractFactory('FranchiseToken');
  const franchise = await FranchiseToken.deploy(
    'Reality Franchise',
    'RFT',
    deployer.address,
    initialFranchiseSupply,
  );
  await franchise.waitForDeployment();

  const RealityShowIP = await ethers.getContractFactory('RealityShowIP');
  const ip = await RealityShowIP.deploy(await franchise.getAddress(), baseURI);
  await ip.waitForDeployment();

  const addresses = {
    network: await deployer.provider?.getNetwork(),
    franchiseToken: await franchise.getAddress(),
    realityShowIP: await ip.getAddress(),
  };

  console.log('Deployed:', addresses);

  const docsDir = path.join(__dirname, '..', 'docs');
  const rootDocs = path.join(__dirname, '..', '..', 'docs');
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
  if (!existsSync(rootDocs)) mkdirSync(rootDocs, { recursive: true });

  writeFileSync(path.join(docsDir, 'addresses.json'), JSON.stringify(addresses, null, 2));
  writeFileSync(path.join(rootDocs, 'addresses.json'), JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

