# RealityOS - Programmable Reality Competition Layer on Story Protocol

RealityOS is a full-stack, IP-native reality show engine.  
It models contestants, episodes, contributions, and fan actions as **programmable IP objects** registered on **Story Protocol**, enriched with **authenticity verification (Yakoa)** and **chain-native economics** through royalty and franchise tokens.

RealityOS demonstrates:

-   IP composability
    
-   IP monetization
    
-   IP authenticity
    
-   participatory storytelling
    
-   on-chain franchise mechanics
    

----------

## **Monorepo Structure**

### **contracts/**

Solidity (Hardhat) implementation:

-   `RealityShowIP.sol` — registers contestants, episodes, fan contributions; emits analytics events; mints royalty fractions; assigns licensing rules.
    
-   `FranchiseToken.sol` — staking + participation influence.  
    Includes deploy scripts and sample tests.
    

### **backend/**

Fastify API providing:

-   registration endpoint → registers IP through Story
    
-   Yakoa authenticity check → returns structured originality metadata
    
-   metadata generation for Story
    
-   event indexer (Prisma models provided)
    

Uses SQLite (default) with Prisma.

### **frontend/**

Next.js with:

-   wallet abstraction (Coinbase Embedded + Dynamic)
    
-   IP dashboard (contestants, episodes, contributions)
    
-   fan actions (votes, predictions, staking)
    
-   royalty token investment flow
    
-   Yakoa “authenticity check → register as IP” action
    

Designed for Vercel deployment.

### **integrations/**

TypeScript clients:

-   Story Protocol API
    
-   Yakoa API
    
-   abv.dev for converting media → registerable metadata
    
-   IPFS uploader
    

Reusable across backend and scripts.

### **scripts/**

Operational tasks:

-   register contestant
    
-   register episode
    
-   register fan contribution
    
-   deploy contracts
    
-   e2e “Happy Path” for demo simulations
    

### **docs/**

-   Dune-ready event schemas
    
-   Franchise flow diagram
    
-   Demo-day script outline
    
-   Deployment notes
    
-   Address registry
    

----------

## **Quickstart**

### 1. Install Dependencies

`npm install` 

### 2. Configure Environment

`cp .env.example .env` 

Add:

-   Story RPC
    
-   Private key for deployer
    
-   Yakoa API key
    
-   Backend URL (for frontend)
    

----------

## **Contracts**

`cd contracts
npm install
npm run compile
npm run test
npm run deploy:story` 

Deployed addresses are written to `docs/addresses.json`.

----------

## **Backend**

`cd backend
npm install
npx prisma migrate dev
npm run dev` 

----------

## **Frontend**

`cd frontend
npm install
npm run dev` 

Requires:

-   backend running
    
-   deployed contract addresses
    

----------

## **E2E Demo Flow**

1.  Deploy contracts
    
2.  Run scripts:
    
    `registerContestant registerEpisode
    registerContribution` 
    
3.  Open frontend:
    
    -   view registered IP
        
    -   mint/buy royalty tokens
        
    -   vote
        
    -   stake franchise token
        

Produces the complete RealityOS cycle.

----------

## **Testing & Lint**

`npm run lint
npm run format
npm run test --workspaces` 

----------

## **Deployment Targets**

-   **Contracts:** Story testnet via Hardhat
    
-   **Frontend:** Vercel
    
-   **Backend:** Render/Fly/NodeHost
    
-   **DB:** SQLite (local) / Postgres (prod optional)