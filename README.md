# GitBounty Board

GitBounty Board is a decentralized application that revolutionizes open-source development by allowing anyone to place a cryptocurrency bounty on any GitHub issue. It creates a transparent and incentivized marketplace for developers to solve problems and get rewarded directly for their contributions.

## The Problem

Open-source projects often rely on volunteer contributors, which can lead to slow development and critical issues being left unresolved for long periods. It can be difficult for project maintainers to incentivize developers to tackle specific or urgent tasks.

## The Solution

GitBounty Board provides a trustless platform where:

-   **Funders** can create a bounty for any public GitHub issue, locking cryptocurrency into a secure smart contract.
-   **Developers** can browse open bounties, work on issues they are qualified to solve, and claim the reward upon completion.
-   **Transparency** is guaranteed, as all bounty creations, assignments, and payments are recorded on the blockchain.

The platform leverages smart contracts to act as a decentralized escrow service, ensuring that funds are only released to the developer once the bounty creator confirms the issue has been resolved.

## How It Works

1.  **Create a Bounty**: A user connects their wallet and provides a GitHub issue URL. They specify a bounty amount in DBT (DevBounty Token), which is then locked in an escrow smart contract.
2.  **Assign a Solver**: The creator assigns the bounty to a specific developer's wallet address at the time of creation.
3.  **Completion & Payout**: Once the work is done and the corresponding pull request is merged, the bounty creator can mark the bounty as "Completed". This action triggers the smart contract to release the locked funds to the solver's wallet.

## Technology Stack

-   **Frontend**: Next.js, React, TypeScript
-   **Styling**: Tailwind CSS, ShadCN UI
-   **Blockchain Interaction**: wagmi, viem
-   **Smart Contracts**: Solidity, OpenZeppelin
-   **AI Integration**: Genkit for summarizing GitHub issues.
-   **Deployment**: Vercel

## Getting Started

1.  **Connect Wallet**: Connect your Web3 wallet (e.g., MetaMask). Make sure you are on the Base Sepolia test network.
2.  **Set Profile**: Go to the Profile tab and set your GitHub username.
3.  **Create or Browse**: You can create a new bounty for a GitHub issue or browse existing bounties created by others.
