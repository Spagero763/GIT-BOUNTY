# **App Name**: GitBounty Board

## Core Features:

- Bounty Display: Display a list of GitHub issues with associated bounties, fetched directly from user-inputted GitHub issue URLs. Display each Github issue bounty with associated information.
- Issue Summarizer: The app uses a tool, powered by generative AI, to perform text summarization of long github issue threads to help prospective solvers efficiently understand issues and make go/no-go decisions on which ones to take on.
- Bounty Filtering: Filter and sort bounties based on criteria like creation date, bounty size, or keywords found in the Github issue.
- Bounty Creation: Allow users to input a GitHub issue URL and a bounty amount, creating a new bounty entry within the app. Note: No actual transaction on chain takes place. The app should only persist locally to browser storage.
- Profile Management: Store Github user information locally (github name). Enable the display user profiles featuring listed bounties and assigned bounties, all saved within the user's local storage.
- Sorting Options: Provide multiple sort options that apply to all bounty views.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5), evoking a sense of trust and technological innovation appropriate to a finance-themed app, while remaining creative.
- Background color: Light Gray (#F0F4F8), creating a clean and modern backdrop to ensure readability and focus on content.
- Accent color: Teal (#009688), provides a vibrant contrast to the indigo, used sparingly for interactive elements and highlights.
- Body font: 'Inter' sans-serif for a modern and neutral appearance.
- Headline font: 'Space Grotesk' sans-serif to bring a computerized, techy, scientific feel.
- Use Font Awesome icons to visually represent bounty categories, status, and actions.
- Employ a card-based layout for bounties to organize information clearly. Maximize the cards to fill the container horizontally on larger screen, and stack cards on smaller screens for easy mobile usability.
- Implement subtle transition effects (e.g., fade-in, slide-in) to provide feedback upon user actions and maintain user engagement.