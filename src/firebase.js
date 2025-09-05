import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBECsZnBbrRHiP83yHc2fp-2WI9Ye2R2aI",
  authDomain: "optisisgroup.firebaseapp.com",
  projectId: "optisisgroup",
  storageBucket: "optisisgroup.appspot.com",
  messagingSenderId: "395696515066",
  appId: "1:395696515066:web:f7f2e28e51354965842643",
  measurementId: "G-3RW90FMPXT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
