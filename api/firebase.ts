
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// BELANGRIJK: Vervang onderstaande waarden met je eigen Firebase config
// Je vindt deze in de Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "VUL_HIER_JE_API_KEY_IN",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "jouw-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "jouw-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "jouw-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed. Check your config keys.", error);
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
