# Franchise Flow (Text Diagram)

1) Deploy `FranchiseToken` (RFT) and `RealityShowIP`.
2) Register contestant → mint royalty fractions (ERC1155 id=contestantId).
3) Create episodes tied to contestant → optional royalty fractions (id=episodeId).
4) Fans submit contributions → stored as contribution assets (id=contributionId).
5) Fans stake RFT into `RealityShowIP.stake`:
   - stake tracked on-chain
   - reputation increments 1:1 with stake
6) Votes + contributions surface reputation to influence:
   - contestant ranking
   - storyline direction (episode prompts)
   - challenge selection
7) Economic flows:
   - royalty fractions trade/sell → `RoyaltyFractionMinted` + transfers
   - investment actions logged in backend `economic_participation`
8) Indexer ingests events → Dune tables → dashboard.

