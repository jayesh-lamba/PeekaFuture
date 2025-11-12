// FIX: Updated Firebase service to use the modern v9+ modular syntax to match the imported SDK version.
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
// FIX: Imported College type.
import type { CareerStream, College, StreamData, EntrepreneurshipData } from '../types';

// Your web app's Firebase configuration
// IMPORTANT: To fix 'auth/unauthorized-domain' errors, you MUST add your application's domain
// to the list of authorized domains in your Firebase project console.
// Go to: Firebase Console > Authentication > Settings > Authorized domains > Add domain.
// For local development, you need to add 'localhost'.
const firebaseConfig = {
  apiKey: "AIzaSyASPwQ7JQOkKCaphVGdNdU5jc91T_TGKD8",
  authDomain: "peekafuture-472405.firebaseapp.com",
  projectId: "peekafuture-472405",
  storageBucket: "peekafuture-472405.firebasestorage.app",
  messagingSenderId: "723380636666",
  appId: "1:723380636666:web:2a1b2c3d4e5f6a7b8c9d0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();

export { auth, onAuthStateChanged };

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // After user is created, update their profile with the display name
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }
  return userCredential;
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const getCareerStreamData = async (): Promise<CareerStream[]> => {
  const careerCollection = collection(db, 'careers');
  const careerSnapshot = await getDocs(careerCollection);
   if (careerSnapshot.empty) {
        console.error("CRITICAL: 'careers' collection is empty in Firestore.");
        return [];
    }
  const careerList = careerSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().stream,
    avg_salary: doc.data().avg_salary,
  } as CareerStream));
  return careerList;
};

export const getCollegeData = async (): Promise<College[]> => {
  const collegeCollection = collection(db, 'colleges');
  const collegeSnapshot = await getDocs(collegeCollection);
   if (collegeSnapshot.empty) {
        console.error("CRITICAL: 'colleges' collection is empty in Firestore.");
        return [];
    }
  const collegeList = collegeSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as College));
  return collegeList;
};

export const getStreamData = async (): Promise<StreamData[]> => {
  const streamCollection = collection(db, 'streams');
  const streamSnapshot = await getDocs(streamCollection);
  if (streamSnapshot.empty) {
    console.error("CRITICAL: 'streams' collection is empty in Firestore.");
    return [];
  }
  return streamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StreamData));
};

export const getEntrepreneurshipData = async (): Promise<EntrepreneurshipData[]> => {
  const entreCollection = collection(db, 'entrepreneurship');
  const entreSnapshot = await getDocs(entreCollection);
  if (entreSnapshot.empty) {
    console.error("CRITICAL: 'entrepreneurship' collection is empty in Firestore.");
    return [];
  }
  return entreSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EntrepreneurshipData));
};

// Cloud Function Caller
export const getRoadmapPdf = httpsCallable<{ roadmap: any; career: string; stream: string }, { downloadUrl: string }>(functions, 'generatePdfReport');
