
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
    <header className="sticky top-0 z-10 flex h-auto min-h-16 flex-wrap items-center gap-4 border-b bg-background/80 p-4 backdrop-blur-sm md:px-8">
      <div className="flex flex-1 items-center gap-2 min-w-max">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground whitespace-nowrap">Descendants de BOUKA AUGUST</h1>
      </div>
      <div className="flex w-full flex-1 items-center justify-end gap-2 sm:w-auto sm:flex-initial">
        <div className="relative flex-1 sm:flex-initial sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={onSearch}
            />
        </div>
        <Button onClick={onAddMember} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
        <Button onClick={onExport} variant="default" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>
    </header>
  );
}
