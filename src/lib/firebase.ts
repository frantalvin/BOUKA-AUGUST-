import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "familybloom-xgbc8",
  "appId": "1:1034609072036:web:78ce42549a8bc0edaa5331",
  "storageBucket": "familybloom-xgbc8.firebasestorage.app",
  "apiKey": "AIzaSyDr59OaK2hYYrpK0MWElI7_F8_9ciRvPUc",
  "authDomain": "familybloom-xgbc8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1034609072036"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, db, storage };
