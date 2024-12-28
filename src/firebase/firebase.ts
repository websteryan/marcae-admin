
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User
} from 'firebase/auth';
import { getFirebaseConfig } from './config';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
export const db = getFirestore(app);
export const signInUser = async (
  email: string, 
  password: string
) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
}

export const userStateListener = (callback:NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback)
}

export const SignOutUser = async () => await signOut(auth);
