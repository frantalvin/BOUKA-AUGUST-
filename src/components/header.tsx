
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
      <div className="flex items-center gap-2 mr-4">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground whitespace-nowrap">Descendants de BOUKA AUGUST</h1>
      </div>
      <div className="flex w-full flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
        <form className="flex-1 sm:flex-initial max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un membre..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={onSearch}
            />
          </div>
        </form>
        <Button onClick={onAddMember} variant="outline" className="hidden sm:inline-flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
        <Button onClick={onExport} variant="default" className="hidden sm:inline-flex">
          <FileDown className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>
    </header>
  );
}
