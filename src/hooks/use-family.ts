"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Person } from '@/lib/types';
import { useToast } from './use-toast';
import { getFamilyMembers, addFamilyMember } from '@/services/family-service';

export const useFamily = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadFamilyData = useCallback(async () => {
    setIsLoading(true);
    try {
      const members = await getFamilyMembers();
       if (members.length === 0) {
        // You might want to seed initial data here if the database is empty
      }
      setPeople(members);
    } catch (error) {
      console.error("Failed to fetch family members:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Les données de la famille n'ont pas pu être chargées.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFamilyData();
  }, [loadFamilyData]);


  const addPerson = async (personData: Omit<Person, 'id'>) => {
    try {
      await addFamilyMember(personData);
      toast({
        title: "Membre ajouté",
        description: `${personData.firstName} ${personData.lastName} a été ajouté(e) à l'arbre généalogique.`,
      });
      await loadFamilyData(); // Refresh data
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nouveau membre n'a pas pu être ajouté. Veuillez réessayer.",
      });
    }
  };

  return { people, addPerson, isLoading };
};
