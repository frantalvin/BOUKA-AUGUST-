"use client";

import { useState, useEffect } from 'react';
import type { Person } from '@/lib/types';
import { useToast } from './use-toast';

const initialFamilyData: Person[] = [
  { id: '1', firstName: 'Éléonore', lastName: 'Vance', dob: '1945-05-20', parentId: null, profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '2', firstName: 'Liam', lastName: 'Vance', dob: '1970-02-15', parentId: '1', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '3', firstName: 'Nora', lastName: 'Vance', dob: '1972-11-30', parentId: '1', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '4', firstName: 'Owen', lastName: 'Vance', dob: '1995-07-10', parentId: '2', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '5', firstName: 'Chloé', lastName: 'Vance', dob: '1998-09-05', parentId: '2', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '6', firstName: 'Mason', lastName: 'Vance', dob: '2001-03-22', parentId: '3', profilePictureUrl: 'https://placehold.co/100x100.png' },
];

export const useFamily = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      try {
        const storedPeople = localStorage.getItem('familyTree');
        if (storedPeople) {
          setPeople(JSON.parse(storedPeople));
        } else {
          setPeople(initialFamilyData);
        }
      } catch (error) {
        setPeople(initialFamilyData);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  const updatePeople = (newPeople: Person[]) => {
    setPeople(newPeople);
    try {
      localStorage.setItem('familyTree', JSON.stringify(newPeople));
    } catch (error) {
      console.error("Failed to save to local storage", error);
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: "Les modifications n'ont pas pu être sauvegardées localement.",
      });
    }
  };

  const addPerson = (personData: Omit<Person, 'id'>) => {
    try {
      const newPerson: Person = { ...personData, id: crypto.randomUUID() };
      updatePeople([...people, newPerson]);
       toast({
        title: "Membre ajouté",
        description: `${newPerson.firstName} ${newPerson.lastName} a été ajouté(e) à l'arbre généalogique.`,
      });
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
