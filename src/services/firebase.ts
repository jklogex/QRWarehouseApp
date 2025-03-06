import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';

// Your Firebase configuration
// Replace with your actual Firebase config when deploying
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email: string, password: string, role: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role,
      displayName,
      createdAt: new Date(),
      status: role === 'driver' ? 'not_cleared' : 'active'
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

// Driver functions
export const updateDriverStatus = async (driverId: string, status: string) => {
  try {
    await updateDoc(doc(db, "users", driverId), {
      status,
      lastUpdated: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Supervisor functions
export const getDriversList = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "driver"));
    const querySnapshot = await getDocs(q);
    const drivers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, drivers };
  } catch (error) {
    return { success: false, error };
  }
};

export { auth, db }; 