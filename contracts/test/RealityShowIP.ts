import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { FranchiseToken as FranchiseTokenType, RealityShowIP as RealityShowIPType } from '../typechain-types';

describe('RealityShowIP', () => {
  async function deployFixture() {
    const [deployer, contributor, fan] = await ethers.getSigners();

    const FranchiseToken = await ethers.getContractFactory('FranchiseToken');
    const franchise = (await FranchiseToken.deploy(
      'Reality Franchise',
      'RFT',
      deployer.address,
      1_000_000n,
    )) as unknown as FranchiseTokenType;

    const RealityShowIP = await ethers.getContractFactory('RealityShowIP');
    const ip = (await RealityShowIP.deploy(
      await franchise.getAddress(),
      'ipfs://reality/',
    )) as unknown as RealityShowIPType;

    return { deployer, contributor, fan, franchise, ip };
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

  it('mints additional royalty fractions with event emission', async () => {
    const { deployer, ip } = await deployFixture();
    await ip.registerContestant('ipfs://contestant/1', 500, 0, ethers.ZeroAddress);

    await expect(ip.mintRoyaltyFraction(deployer.address, 1, 50)).to.emit(ip, 'RoyaltyFractionMinted');
    expect(await ip.balanceOf(deployer.address, 1)).to.equal(50);
  });

  it('runs episode → royalty → fan actions integration path', async () => {
    const { deployer, contributor, fan, franchise, ip } = await deployFixture();

    // register base assets
    await ip.registerContestant('ipfs://contestant/1', 500, 100, deployer.address);
    await ip.registerEpisode(1, 'ipfs://episode/1', 300, 25, deployer.address);
    await ip.registerContribution(2, contributor.address, 'ipfs://contrib/1', 200);

    // mint royalties to fan
    await expect(ip.mintRoyaltyFraction(fan.address, 2, 10)).to.emit(ip, 'RoyaltyFractionMinted');
    expect(await ip.balanceOf(fan.address, 2)).to.equal(10);

    // vote updates reputation
    await expect(ip.recordVote(3, fan.address, 5)).to.emit(ip, 'VoteRecorded');
    expect(await ip.reputation(fan.address)).to.equal(5);

    // stake franchise token boosts reputation and totals
    await franchise.transfer(fan.address, 1_000);
    await franchise.connect(fan).approve(await ip.getAddress(), 500);
    await expect(ip.connect(fan).stake(500)).to.emit(ip, 'FranchiseStaked');
    expect(await ip.franchiseStake(fan.address)).to.equal(500);
    expect(await ip.totalFranchiseStaked()).to.equal(500);
    expect(await ip.reputation(fan.address)).to.equal(505);
  });
});

