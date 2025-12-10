import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { ethers, artifacts } from 'hardhat';

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
  const abiDir = path.join(docsDir, 'abis');
  const rootAbiDir = path.join(rootDocs, 'abis');
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
  if (!existsSync(rootDocs)) mkdirSync(rootDocs, { recursive: true });
  if (!existsSync(abiDir)) mkdirSync(abiDir, { recursive: true });
  if (!existsSync(rootAbiDir)) mkdirSync(rootAbiDir, { recursive: true });

  writeFileSync(path.join(docsDir, 'addresses.json'), JSON.stringify(addresses, null, 2));
  writeFileSync(path.join(rootDocs, 'addresses.json'), JSON.stringify(addresses, null, 2));

  const realityArtifact = await artifacts.readArtifact('RealityShowIP');
  const franchiseArtifact = await artifacts.readArtifact('FranchiseToken');
  const writeAbi = (dir: string) => {
    writeFileSync(path.join(dir, 'RealityShowIP.json'), JSON.stringify({ abi: realityArtifact.abi }, null, 2));
    writeFileSync(path.join(dir, 'FranchiseToken.json'), JSON.stringify({ abi: franchiseArtifact.abi }, null, 2));
  };
  writeAbi(abiDir);
  writeAbi(rootAbiDir);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

