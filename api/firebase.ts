
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// BELANGRIJK VOOR GITHUB:
// De keys staan nu NIET meer hardcoded in dit bestand.
// Dit haalt de waarden uit de omgevingsvariabelen (Environment Variables).
//
// 1. Lokaal: Maak een bestand genaamd '.env' in je hoofdmap en zet daar je keys in:
//    VITE_FIREBASE_API_KEY=JouwKeyHier
//    VITE_FIREBASE_PROJECT_ID=glowexamen
//    ...etc
//
// 2. Google Cloud Run: Voeg deze variabelen toe onder 'Variables & Secrets' bij 'Edit & Deploy'.

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let db;
let analytics;

try {
    // Check of config aanwezig is voordat we initialiseren
    if (!firebaseConfig.apiKey) {
        console.warn("Firebase config ontbreekt. Check je .env bestand of Cloud Run variabelen.");
    } else {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        analytics = getAnalytics(app);
        console.log("Firebase initialized successfully");
    }
} catch (error) {
    console.error("Firebase initialization failed.", error);
}

export { db };

export const getUserDataFromFirestore = async (userId: string) => {
    if (!db) return null;
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
};

export const saveUserDataToFirestore = async (userId: string, data: any) => {
    if (!db) return;
    try {
        // We gebruiken setDoc met merge: true zodat we bestaande data niet overschrijven als we maar een deel updaten
        await setDoc(doc(db, "users", userId), data, { merge: true });
        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error writing document: ", error);
    }
};
