
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Person } from '@/lib/types';
import { useToast } from './use-toast';
import { getFamilyMembers, addFamilyMember } from '@/services/family-service';

export const useFamily = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadFamilyData = async () => {
      setIsLoading(true);
      try {
        const members = await getFamilyMembers();
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
    };
    loadFamilyData();
  }, [toast]);


  const addPerson = async (personData: Omit<Person, 'id'>): Promise<Person | undefined> => {
    try {
      const newPerson = await addFamilyMember(personData);
      setPeople((prevPeople) => [...prevPeople, newPerson]);
      toast({
        title: "Membre ajouté",
        description: `${newPerson.firstName} ${newPerson.lastName} a été ajouté(e) à l'arbre généalogique.`,
      });
      return newPerson;
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nouveau membre n'a pas pu être ajouté. Veuillez réessayer.",
      });
      return undefined;
    }
  };

  return { people, addPerson, isLoading };
};
