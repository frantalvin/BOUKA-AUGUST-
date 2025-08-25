"use client";

import { useState, useMemo, useCallback } from "react";
import { useFamily } from "@/hooks/use-family";
import { buildTree } from "@/lib/utils";
import type { Person } from "@/lib/types";
import { Header } from "@/components/header";
import { FamilyTree } from "@/components/family-tree";
import { AddMemberForm } from "@/components/add-member-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Home() {
  const { people, addPerson, isLoading } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);

  const familyTreeRoots = useMemo(() => buildTree(people), [people]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  const handleAddMember = (data: Omit<Person, "id">) => {
    addPerson(data);
    setAddMemberOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header
        onAddMember={() => setAddMemberOpen(true)}
        onSearch={handleSearch}
        onExport={handleExport}
        searchQuery={searchQuery}
      />
      <main className="flex-grow flex flex-col p-4 md:p-8 overflow-hidden">
        <div id="family-tree-container" className="flex-grow w-full h-full overflow-auto p-4">
          <FamilyTree roots={familyTreeRoots} searchQuery={searchQuery} isLoading={isLoading} />
        </div>
      </main>
      <Dialog open={isAddMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Add a Family Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new family member.
            </DialogDescription>
          </DialogHeader>
          <AddMemberForm
            onSubmit={handleAddMember}
            existingMembers={people}
            onCancel={() => setAddMemberOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
