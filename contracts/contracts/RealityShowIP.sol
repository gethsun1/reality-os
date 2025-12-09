// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC1155, ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {FranchiseToken} from "./FranchiseToken.sol";

/// @title RealityShowIP
/// @notice Manages contestant, episode, and fan contribution IP assets with royalty tokenization and franchise staking.
/// @dev Story Protocol primitives are represented as metadata + licensing hooks; integrate SDK off-chain or via future upgrades.
contract RealityShowIP is ERC1155Supply, Ownable, ReentrancyGuard {
    using Strings for uint256;

    enum AssetType {
        Contestant,
        Episode,
        Contribution
    }

    struct Asset {
        AssetType assetType;
        string metadataURI;
        address creator;
        uint16 royaltyBps; // license/royalty rate in basis points
        uint64 createdAt;
        uint256 parentId; // episode->contestant, contribution->episode
    }

    struct LicenseRule {
        uint16 royaltyBps;
        string termsURI; // pointer to Story Protocol license terms document
    }

    uint256 public nextAssetId = 1;
    FranchiseToken public franchiseToken;

    mapping(uint256 => Asset) public assets;
    mapping(uint256 => LicenseRule) public licenseRules;
    mapping(address => uint256) public reputation;
    mapping(address => uint256) public franchiseStake;
    uint256 public totalFranchiseStaked;

    event ContestantRegistered(
        uint256 indexed contestantId,
        address indexed creator,
        string metadataURI,
        uint256 royaltyTokenId,
        uint16 royaltyBps
    );
    event EpisodeTokenized(
        uint256 indexed episodeId,
        uint256 indexed contestantId,
        string metadataURI,
        uint256 royaltyTokenId,
        uint16 royaltyBps
    );
    event FanContributionRegistered(
        uint256 indexed contributionId,
        uint256 indexed episodeId,
        address indexed contributor,
        string metadataURI,
        uint16 royaltyBps
    );
    event RoyaltyFractionMinted(
        uint256 indexed assetId,
        address indexed to,
        uint256 amount
    );
    event LicenseRuleUpdated(
        uint256 indexed assetId,
        uint16 royaltyBps,
        string termsURI
    );
    event FranchiseStaked(address indexed staker, uint256 amount, uint256 totalStaked);
    event FranchiseUnstaked(address indexed staker, uint256 amount, uint256 totalStaked);
    event VoteRecorded(uint256 indexed assetId, address indexed voter, uint256 weight);

    constructor(address franchiseTokenAddress, string memory baseURI) ERC1155(baseURI) {
        franchiseToken = FranchiseToken(franchiseTokenAddress);
    }

    // ------------- Registration -------------

    function registerContestant(
        string memory metadataURI,
        uint16 royaltyBps,
        uint256 initialRoyaltySupply,
        address initialRoyaltyRecipient
    ) external nonReentrant onlyOwner returns (uint256 contestantId) {
        contestantId = _createAsset(
            AssetType.Contestant,
            metadataURI,
            msg.sender,
            0,
            royaltyBps
        );

        _setLicenseRule(contestantId, royaltyBps, metadataURI);

        if (initialRoyaltySupply > 0 && initialRoyaltyRecipient != address(0)) {
            _mint(initialRoyaltyRecipient, contestantId, initialRoyaltySupply, "");
            emit RoyaltyFractionMinted(contestantId, initialRoyaltyRecipient, initialRoyaltySupply);
        }

        emit ContestantRegistered(
            contestantId,
            msg.sender,
            metadataURI,
            contestantId,
            royaltyBps
        );
    }

    function registerEpisode(
        uint256 contestantId,
        string memory metadataURI,
        uint16 royaltyBps,
        uint256 initialRoyaltySupply,
        address initialRoyaltyRecipient
    ) external nonReentrant onlyOwner returns (uint256 episodeId) {
        require(_exists(contestantId), "contestant missing");
        require(assets[contestantId].assetType == AssetType.Contestant, "not contestant");

        episodeId = _createAsset(
            AssetType.Episode,
            metadataURI,
            msg.sender,
            contestantId,
            royaltyBps
        );

        _setLicenseRule(episodeId, royaltyBps, metadataURI);

        if (initialRoyaltySupply > 0 && initialRoyaltyRecipient != address(0)) {
            _mint(initialRoyaltyRecipient, episodeId, initialRoyaltySupply, "");
            emit RoyaltyFractionMinted(episodeId, initialRoyaltyRecipient, initialRoyaltySupply);
        }

        emit EpisodeTokenized(episodeId, contestantId, metadataURI, episodeId, royaltyBps);
    }

    function registerContribution(
        uint256 episodeId,
        address contributor,
        string memory metadataURI,
        uint16 royaltyBps
    ) external nonReentrant returns (uint256 contributionId) {
        require(_exists(episodeId), "episode missing");
        require(assets[episodeId].assetType == AssetType.Episode, "not episode");
        require(contributor != address(0), "bad contributor");

        contributionId = _createAsset(
            AssetType.Contribution,
            metadataURI,
            contributor,
            episodeId,
            royaltyBps
        );

        _setLicenseRule(contributionId, royaltyBps, metadataURI);
        reputation[contributor] += 1;

        emit FanContributionRegistered(contributionId, episodeId, contributor, metadataURI, royaltyBps);
    }

    // ------------- Royalty and Licensing -------------

    function mintRoyaltyFraction(address to, uint256 assetId, uint256 amount) external onlyOwner {
        require(_exists(assetId), "asset missing");
        _mint(to, assetId, amount, "");
        emit RoyaltyFractionMinted(assetId, to, amount);
    }

    function updateLicenseRule(
        uint256 assetId,
        uint16 royaltyBps,
        string memory termsURI
    ) external onlyOwner {
        require(_exists(assetId), "asset missing");
        _setLicenseRule(assetId, royaltyBps, termsURI);
        emit LicenseRuleUpdated(assetId, royaltyBps, termsURI);
    }

    // ------------- Fan Engagement -------------

    function recordVote(uint256 assetId, address voter, uint256 weight) external onlyOwner {
        require(_exists(assetId), "asset missing");
        require(voter != address(0), "bad voter");
        reputation[voter] += weight;
        emit VoteRecorded(assetId, voter, weight);
    }

    // ------------- Franchise Staking -------------

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount zero");
        franchiseToken.transferFrom(msg.sender, address(this), amount);
        franchiseStake[msg.sender] += amount;
        totalFranchiseStaked += amount;
        reputation[msg.sender] += amount; // simple reputation boost
        emit FranchiseStaked(msg.sender, amount, totalFranchiseStaked);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount zero");
        require(franchiseStake[msg.sender] >= amount, "insufficient stake");
        franchiseStake[msg.sender] -= amount;
        totalFranchiseStaked -= amount;
        franchiseToken.transfer(msg.sender, amount);
        emit FranchiseUnstaked(msg.sender, amount, totalFranchiseStaked);
    }

    // ------------- Views -------------

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory base = super.uri(tokenId);
        if (bytes(base).length == 0) return "";
        return string(abi.encodePacked(base, tokenId.toString(), ".json"));
    }

    function _exists(uint256 assetId) internal view returns (bool) {
        return assetId > 0 && assetId < nextAssetId && bytes(assets[assetId].metadataURI).length > 0;
    }

    // ------------- Internal -------------

    function _createAsset(
        AssetType assetType,
        string memory metadataURI,
        address creator,
        uint256 parentId,
        uint16 royaltyBps
    ) internal returns (uint256 assetId) {
        require(creator != address(0), "creator zero");
        assetId = nextAssetId;
        nextAssetId++;

        assets[assetId] = Asset({
            assetType: assetType,
            metadataURI: metadataURI,
            creator: creator,
            royaltyBps: royaltyBps,
            createdAt: uint64(block.timestamp),
            parentId: parentId
        });
    }

    function _setLicenseRule(
        uint256 assetId,
        uint16 royaltyBps,
        string memory termsURI
    ) internal {
        licenseRules[assetId] = LicenseRule({royaltyBps: royaltyBps, termsURI: termsURI});
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

