// authService.js
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export const login = async (email, password) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error('Login error:', error.message);
  }
};

export const register = async (email, password) => {
  try {
    const auth = getAuth();
    const db = getFirestore();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      email: user.email,
      uid: user.uid,
      emailVerified: user.emailVerified,
    });

    await sendEmailVerification(user);
  } catch (error) {
    throw new Error('Registration error: ' + error.message); 
  }
};