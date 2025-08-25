
"use client";

import { useState, useMemo, useCallback } from "react";
import { useFamily } from "@/hooks/use-family";
import { buildTree } from "@/lib/utils";
import type { Person } from "@/lib/types";
import { Header } from "@/components/header";
import { FamilyTree } from "@/components/family-tree";
import { AddMemberForm } from "@/components/add-member-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { addFamilyMember } from "@/services/family-service";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const { people, setPeople, isLoading } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);
  const { toast } = useToast();

  const familyTreeRoots = useMemo(() => buildTree(people), [people]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  const handleAddMember = async (data: Omit<Person, "id">) => {
    try {
      const newMemberData = {
        ...data,
        parentId: data.parentId === 'none' ? null : data.parentId,
      };
      const newPerson = await addFamilyMember(newMemberData);
      setPeople((prevPeople) => [...prevPeople, newPerson]);
      setAddMemberOpen(false);
      toast({
        title: "Membre ajouté",
        description: `${newPerson.firstName} ${newPerson.lastName} a été ajouté(e) à l'arbre généalogique.`,
      });
    } catch (error) {
      console.error("Failed to add family member:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nouveau membre n'a pas pu être ajouté. Veuillez réessayer.",
      });
    }
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
        <div id="family-tree-container" className="flex-grow w-full h-full overflow-auto p-4 flex">
          <FamilyTree roots={familyTreeRoots} searchQuery={searchQuery} isLoading={isLoading} />
        </div>
      </main>
      <Dialog open={isAddMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Ajouter un membre de la famille</DialogTitle>
            <DialogDescription>
              Entrez les détails du nouveau membre de la famille.
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
