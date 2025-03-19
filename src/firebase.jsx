import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFoW8PC6l1y9mhFqIWnblsmbBuf8us2QU",
  authDomain: "chatty-6db74.firebaseapp.com",
  projectId: "chatty-6db74",
  storageBucket: "chatty-6db74.firebasestorage.app",
  messagingSenderId: "883333196864",
  appId: "1:883333196864:web:5c706603264c2b01d003a5",
  measurementId: "G-X7QLQPKQ44"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, firestore, analytics };
