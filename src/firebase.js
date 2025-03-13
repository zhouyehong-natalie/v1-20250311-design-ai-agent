import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

// ✅ 替换为你的 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBuF8L_bRG6DvJeasz7aRGNIBlM6ktDky4",
  authDomain: "v1-design-ai-agent.firebaseapp.com",
  projectId: "v1-design-ai-agent",
  storageBucket: "v1-design-ai-agent.appspot.com",
  messagingSenderId: "679753835049",
  appId: "1:679753835049:web:f7dbb44fb40ea679867238",
  measurementId: "G-BXDWS5SQEC"
};

// ✅ 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 确保正确导出 `updateDoc` 和 `doc`
export { db, collection, addDoc, getDocs, doc, updateDoc };
