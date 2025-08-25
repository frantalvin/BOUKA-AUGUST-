"use client";

import type { ChangeEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, FileDown, Users } from 'lucide-react';

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
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">descends BOUKA AUGUST</h1>
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
