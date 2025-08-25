
"use client";

import { useState, useMemo, useCallback } from "react";
import { useFamily } from "@/hooks/use-family";
import { buildTree } from "@/lib/utils";
import type { Person } from "@/lib/types";
import { Header } from "@/components/header";
import { FamilyTree } from "@/components/family-tree";
import { AddMemberForm } from "@/components/add-member-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { addFamilyMember, updateFamilyMember } from "@/services/family-service";
import { useToast } from "@/hooks/use-toast";
import { generateBio, GenerateBioInput } from "@/ai/flows/generate-bio-flow";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";


export default function Home() {
  const { people, setPeople, isLoading } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setEditMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Person | null>(null);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [bioContent, setBioContent] = useState('');
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [bioPerson, setBioPerson] = useState<Person | null>(null);


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
      const originalPerson = people.find(p => p.id === editingMember.id);
  
      const updatedData = { 
        ...formData,
        profilePictureUrl: formData.profilePictureUrl || originalPerson?.profilePictureUrl || null
      };
  
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

  const handleGenerateBio = async (person: Person) => {
    setBioPerson(person);
    setIsBioOpen(true);
    setIsBioLoading(true);
    setBioContent('');

    try {
        const parent = person.parentId ? people.find(p => p.id === person.parentId) : undefined;
        const input: GenerateBioInput = {
            firstName: person.firstName,
            lastName: person.lastName,
            dob: person.dob,
            parentName: parent ? `${parent.firstName} ${parent.lastName}` : undefined,
        };
        const bio = await generateBio(input);
        setBioContent(bio);
    } catch (error) {
        console.error("Failed to generate biography:", error);
        setBioContent("La biographie n'a pas pu être générée. Veuillez réessayer.");
        toast({
            variant: "destructive",
            title: "Erreur de l'IA",
            description: "La biographie n'a pas pu être générée. Veuillez réessayer.",
        });
    } finally {
        setIsBioLoading(false);
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
      <main className="flex-grow flex flex-col p-4 md:p-8">
        <div id="family-tree-container" className="flex-grow w-full h-full overflow-auto p-4 flex">
          <FamilyTree 
            roots={familyTreeRoots} 
            searchQuery={searchQuery} 
            isLoading={isLoading} 
            onEditMember={openEditDialog}
            onGenerateBio={handleGenerateBio}
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
      <Dialog open={isBioOpen} onOpenChange={setIsBioOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-headline">Biographie de {bioPerson?.firstName} {bioPerson?.lastName}</DialogTitle>
                <DialogDescription>
                    Cette biographie a été générée par une intelligence artificielle.
                </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto pr-4">
                {isBioLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <p>{bioContent}</p>
                )}
            </div>
            <DialogFooter>
                <Button onClick={() => setIsBioOpen(false)}>Fermer</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
