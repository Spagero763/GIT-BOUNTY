import { Github } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold flex items-center justify-center gap-4">
        <Github className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent">
          GitBounty Board
        </span>
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-400 font-body">
        Decentralized GitHub Issue Bounties
      </p>
    </header>
  );
}
