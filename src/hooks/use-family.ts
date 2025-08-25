
"use client";

import { useState, useEffect } from 'react';
import type { Person } from '@/lib/types';
import { useToast } from './use-toast';
import { getFamilyMembers } from '@/services/family-service';

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

  return { people, setPeople, isLoading };
};
