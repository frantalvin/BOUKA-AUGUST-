
"use client";

import { useState, useMemo, useCallback } from "react";
import { useFamily } from "@/hooks/use-family";
import { buildTree } from "@/lib/utils";
import type { Person } from "@/lib/types";
import { Header } from "@/components/header";
import { FamilyTree } from "@/components/family-tree";
import { AddMemberForm } from "@/components/add-member-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { addFamilyMember, updateFamilyMember } from "@/services/family-service";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const { people, setPeople, isLoading } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setEditMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Person | null>(null);

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

  const handleEditMember = async (formData: Omit<Person, 'id'>) => {
    if (!editingMember) return;
  
    try {
      // Find the original person data to get the existing photo URL if needed
      const originalPerson = people.find(p => p.id === editingMember.id);
  
      // Prepare the data for update
      const updatedData = { ...formData };
  
      // If the profile picture URL in the form is the same as the original,
      // it means the user hasn't uploaded a new one.
      // We explicitly keep the original URL.
      if (formData.profilePictureUrl === originalPerson?.profilePictureUrl) {
         updatedData.profilePictureUrl = originalPerson.profilePictureUrl;
      }
  
      // The updateFamilyMember service will handle uploading if it's a new data URI.
      const updatedPerson = await updateFamilyMember(editingMember.id, updatedData);
  
      setPeople((prevPeople) =>
        prevPeople.map((p) => (p.id === editingMember.id ? updatedPerson : p))
      );
      setEditMemberOpen(false);
      setEditingMember(null);
      toast({
        title: "Membre mis à jour",
        description: `Les informations de ${updatedPerson.firstName} ${updatedPerson.lastName} ont été mises à jour.`,
      });
    } catch (error) {
      console.error("Failed to update family member:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les informations du membre n'ont pas pu être mises à jour. Veuillez réessayer.",
      });
    }
  };

  const openEditDialog = (person: Person) => {
    setEditingMember(person);
    setEditMemberOpen(true);
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
          <FamilyTree 
            roots={familyTreeRoots} 
            searchQuery={searchQuery} 
            isLoading={isLoading} 
            onEditMember={openEditDialog}
          />
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

      <Dialog open={isEditMemberOpen} onOpenChange={setEditMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Modifier un membre de la famille</DialogTitle>
            <DialogDescription>
              Mettez à jour les détails du membre de la famille.
            </DialogDescription>
          </DialogHeader>
          <AddMemberForm
            onSubmit={handleEditMember}
            existingMembers={people.filter(p => p.id !== editingMember?.id)}
            onCancel={() => {
              setEditMemberOpen(false);
              setEditingMember(null);
            }}
            initialData={editingMember}
            isEditing
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
