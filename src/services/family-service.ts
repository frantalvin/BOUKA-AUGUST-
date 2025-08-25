import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  documentId,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import type { Person } from '@/lib/types';


const familyCollectionRef = collection(db, 'family');

export const getFamilyMembers = async (): Promise<Person[]> => {
  const querySnapshot = await getDocs(familyCollectionRef);
  const familyMembers = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Person[];
  return familyMembers;
};

export const addFamilyMember = async (personData: Omit<Person, 'id'>): Promise<Person> => {
    let profilePictureUrl = personData.profilePictureUrl || '';

    if (profilePictureUrl && profilePictureUrl.startsWith('data:image')) {
        const storageRef = ref(storage, `profile_pictures/${crypto.randomUUID()}`);
        const uploadResult = await uploadString(storageRef, profilePictureUrl, 'data_url');
        profilePictureUrl = await getDownloadURL(uploadResult.ref);
    }
    
    const newMemberData = { ...personData, profilePictureUrl };

    const docRef = await addDoc(familyCollectionRef, newMemberData);
    return { id: docRef.id, ...newMemberData, profilePictureUrl: newMemberData.profilePictureUrl ?? undefined };
};
