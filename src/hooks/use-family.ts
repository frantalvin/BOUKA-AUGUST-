"use client";

import { useState, useEffect } from 'react';
import type { Person } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // I cannot add new dependencies, so I will use crypto.randomUUID()
import { useToast } from './use-toast';

const initialFamilyData: Person[] = [
  { id: '1', firstName: 'Elara', lastName: 'Vance', dob: '1945-05-20', parentId: null, profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '2', firstName: 'Liam', lastName: 'Vance', dob: '1970-02-15', parentId: '1', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '3', firstName: 'Nora', lastName: 'Vance', dob: '1972-11-30', parentId: '1', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '4', firstName: 'Owen', lastName: 'Vance', dob: '1995-07-10', parentId: '2', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '5', firstName: 'Chloe', lastName: 'Vance', dob: '1998-09-05', parentId: '2', profilePictureUrl: 'https://placehold.co/100x100.png' },
  { id: '6', firstName: 'Mason', lastName: 'Vance', dob: '2001-03-22', parentId: '3', profilePictureUrl: 'https://placehold.co/100x100.png' },
];

export const useFamily = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPeople(initialFamilyData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addPerson = (personData: Omit<Person, 'id'>) => {
    try {
      const newPerson: Person = { ...personData, id: crypto.randomUUID() };
      setPeople(prev => [...prev, newPerson]);
       toast({
        title: "Member Added",
        description: `${newPerson.firstName} ${newPerson.lastName} has been added to the family tree.`,
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add the new member. Please try again.",
      });
    }
  };

  return { people, addPerson, isLoading };
};
