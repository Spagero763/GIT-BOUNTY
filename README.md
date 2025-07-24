
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

## How It Works: The Payout Flow

The process is designed to be trustless, with smart contracts acting as a secure, automated escrow agent.

1.  **Create & Fund a Bounty**: A "Creator" funds a GitHub issue by specifying a bounty amount in DBT (DevBounty Token) and assigning a "Solver's" wallet address.
2.  **Secure Escrow**: The `BountyFactory` smart contract immediately takes the DBT from the Creator and locks it in the `EscrowPayments` contract. The funds are now held securely in escrow, designated for the specific Solver's wallet.
3.  **Work is Completed**: The Solver finishes the task on GitHub and their pull request is merged.
4.  **Creator Confirms Completion**: The Creator clicks "Mark as Completed" in the app. This triggers a secure, server-side transaction that calls the `completeBounty` function on the `BountyFactory` contract.
5.  **Automatic Payout**: The `BountyFactory` contract verifies the action and instructs the `EscrowPayments` contract to release the funds. The `EscrowPayments` contract automatically transfers the locked DBT directly to the Solver's wallet.

This system guarantees that the Creator can't withdraw the funds after they've been committed, and the Solver is assured of their payment as soon as the work is verified.

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
