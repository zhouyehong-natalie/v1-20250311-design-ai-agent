import { db, collection, getDocs } from "./firebase"; // 🔥 引入 Firebase
import fs from "fs"; // 🔹 Node.js 内置文件操作模块

const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "gpt_interactions"));
    const data = [];

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // ✅ 保存为 JSON 文件
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("✅ 数据已下载，保存在 data.json！");
  } catch (error) {
    console.error("❌ 下载数据失败:", error);
  }
};

fetchData();
