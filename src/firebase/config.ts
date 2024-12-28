import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyCguFfdRwDbdsSmNTDBXn8qLUghruVCBSk",
  authDomain: "agendafacil-77.firebaseapp.com",
  projectId: "agendafacil-77",
  storageBucket: "agendafacil-77.firebasestorage.app",
  messagingSenderId: "882811470242",
  appId: "1:882811470242:web:41399d8470c1c4015a32fb",
  measurementId: "G-ZPMKKN9DQE",
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.ts');
  } else {
    return config;
  }
}    
