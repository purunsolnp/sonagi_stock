// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 구성 정보 직접 입력
const firebaseConfig = {
  apiKey: "AIzaSyAjLhcCiaNEvUeCskIZHkAKdVKmuIs_f2o",
  authDomain: "sorustock.firebaseapp.com",
  projectId: "sorustock",
  storageBucket: "sorustock.firebasestorage.app",
  messagingSenderId: "614895524048",
  appId: "1:614895524048:web:eb7f7c32ddc971652b6dfd",
  measurementId: "G-5RR4696DKV"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;