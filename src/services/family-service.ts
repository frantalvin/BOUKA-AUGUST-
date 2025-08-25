
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
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
    const updatedData: Partial<Person> = { ...personData };

    // If a new photo is being uploaded (it's a data URI)
    if (updatedData.profilePictureUrl && updatedData.profilePictureUrl.startsWith('data:image')) {
        const storageRef = ref(storage, `profile_pictures/${crypto.randomUUID()}`);
        const uploadResult = await uploadString(storageRef, updatedData.profilePictureUrl, 'data_url');
        updatedData.profilePictureUrl = await getDownloadURL(uploadResult.ref);
    } else {
        // If no new photo is uploaded, we keep the old one.
        // The personData from the form already contains the existing URL or null.
        // No need to fetch it again. We just ensure it's not undefined.
        updatedData.profilePictureUrl = personData.profilePictureUrl || null;
    }
    
    updatedData.parentId = personData.parentId === 'none' ? null : personData.parentId;

    // We pass the fields to update, which might not include all Person fields
    await updateDoc(docRef, {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        dob: updatedData.dob,
        profilePictureUrl: updatedData.profilePictureUrl,
        parentId: updatedData.parentId,
    });

    // Return the full person object for UI update
    return { id, ...personData, profilePictureUrl: updatedData.profilePictureUrl } as Person;
}
