
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
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
    let profilePictureUrl = personData.profilePictureUrl;

    if (profilePictureUrl && profilePictureUrl.startsWith('data:image')) {
        const storageRef = ref(storage, `profile_pictures/${crypto.randomUUID()}`);
        const uploadResult = await uploadString(storageRef, profilePictureUrl, 'data_url');
        profilePictureUrl = await getDownloadURL(uploadResult.ref);
    }
    
    const newMemberData = { 
      ...personData, 
      profilePictureUrl: profilePictureUrl || null,
      parentId: personData.parentId === 'none' ? null : personData.parentId,
    };

    const docRef = await addDoc(familyCollectionRef, newMemberData);
    return { id: docRef.id, ...newMemberData };
};


export const updateFamilyMember = async (id: string, personData: Omit<Person, 'id'>): Promise<Person> => {
  const docRef = doc(db, 'family', id);
  const dataToUpdate: Partial<Omit<Person, 'id'>> = { ...personData };

  // If a new photo is being uploaded (it's a data URI), upload it to storage.
  if (dataToUpdate.profilePictureUrl && dataToUpdate.profilePictureUrl.startsWith('data:image')) {
      const storageRef = ref(storage, `profile_pictures/${crypto.randomUUID()}`);
      const uploadResult = await uploadString(storageRef, dataToUpdate.profilePictureUrl, 'data_url');
      dataToUpdate.profilePictureUrl = await getDownloadURL(uploadResult.ref);
  }

  // Ensure parentId is null if it's 'none'.
  dataToUpdate.parentId = personData.parentId === 'none' ? null : personData.parentId;

  // Perform the update in Firestore
  await updateDoc(docRef, dataToUpdate);

  // Return the full, updated person object for UI consistency
  return {
      id,
      ...personData,
      profilePictureUrl: dataToUpdate.profilePictureUrl,
      parentId: dataToUpdate.parentId
  };
};
