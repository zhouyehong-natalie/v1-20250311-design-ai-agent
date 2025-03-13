// 🔹 导入 Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// 🔹 你的 Firebase 配置（这是你之前提供的）
const firebaseConfig = {
  apiKey: "AIzaSyBuF8L_bRG6DvJeasz7aRGNIBlM6ktDky4",
  authDomain: "v1-design-ai-agent.firebaseapp.com",
  projectId: "v1-design-ai-agent",
  storageBucket: "v1-design-ai-agent.appspot.com",
  messagingSenderId: "679753835049",
  appId: "1:679753835049:web:f7dbb44fb40ea679867238",
  measurementId: "G-BXDWS5SQEC"
};

// 🔹 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // 🔥 初始化 Firestore 数据库

// 🔹 导出 Firestore 以便在 App.js 使用
export { db, collection, addDoc, getDocs };


