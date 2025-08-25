"use client";

import type { ChangeEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, FileDown } from 'lucide-react';

interface HeaderProps {
  onAddMember: () => void;
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onExport: () => void;
  searchQuery: string;
}

export function Header({ onAddMember, onSearch, onExport, searchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
            <path d="M12 2a10 10 0 00-7.53 16.59l1.42-1.42A8 8 0 1112 4z" />
            <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
            <path d="M12 22v-6" />
            <path d="M12 4V2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
        </svg>
        <h1 className="text-2xl font-bold font-headline text-foreground">FamilleFleurie</h1>
      </div>
      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un membre..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={onSearch}
            />
          </div>
        </form>
        <Button onClick={onAddMember} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
        <Button onClick={onExport} variant="default">
          <FileDown className="mr-2 h-4 w-4" />
          Exporter en PDF
        </Button>
      </div>
    </header>
  );
}
