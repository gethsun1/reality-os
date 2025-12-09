import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('RealityShowIP', () => {
  async function deployFixture() {
    const [deployer, contributor] = await ethers.getSigners();

    const FranchiseToken = await ethers.getContractFactory('FranchiseToken');
    const franchise = await FranchiseToken.deploy('Reality Franchise', 'RFT', deployer.address, 1_000_000n);

    const RealityShowIP = await ethers.getContractFactory('RealityShowIP');
    const ip = await RealityShowIP.deploy(await franchise.getAddress(), 'ipfs://reality/');

    return { deployer, contributor, franchise, ip };
  }

  it('registers contestant, episode, contribution and mints fractions', async () => {
    const { deployer, contributor, franchise, ip } = await deployFixture();

    await expect(
      ip.registerContestant('ipfs://contestant/1', 500, 100, deployer.address),
    ).to.emit(ip, 'ContestantRegistered');

    const contestant = await ip.assets(1);
    expect(contestant.creator).to.equal(deployer.address);
    expect(await ip.balanceOf(deployer.address, 1)).to.equal(100);

    await expect(
      ip.registerEpisode(1, 'ipfs://episode/1', 300, 50, deployer.address),
    ).to.emit(ip, 'EpisodeTokenized');

    const episode = await ip.assets(2);
    expect(episode.parentId).to.equal(1);

    await expect(
      ip.registerContribution(2, contributor.address, 'ipfs://contrib/1', 200),
    ).to.emit(ip, 'FanContributionRegistered');

    const contrib = await ip.assets(3);
    expect(contrib.creator).to.equal(contributor.address);
    const rep = await ip.reputation(contributor.address);
    expect(rep).to.equal(1);
  });

  it('stakes franchise tokens and adjusts reputation', async () => {
    const { deployer, franchise, ip } = await deployFixture();
    await ip.registerContestant('ipfs://contestant/1', 500, 0, ethers.ZeroAddress);

    await franchise.approve(await ip.getAddress(), 1_000);
    await expect(ip.stake(1_000)).to.emit(ip, 'FranchiseStaked');

    expect(await ip.franchiseStake(deployer.address)).to.equal(1_000);
    expect(await ip.totalFranchiseStaked()).to.equal(1_000);
    expect(await ip.reputation(deployer.address)).to.equal(1_000);

    await expect(ip.unstake(400)).to.emit(ip, 'FranchiseUnstaked');
    expect(await ip.franchiseStake(deployer.address)).to.equal(600);
  });
});

