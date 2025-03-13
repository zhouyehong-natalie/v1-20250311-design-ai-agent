import { useState } from "react";
import { db, collection, addDoc, getDocs, doc, updateDoc } from "./firebase";

function App() {
  const [designerRole, setDesignerRole] = useState("");
  const [userProfiles, setUserProfiles] = useState([""]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [designGuide, setDesignGuide] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastDocId, setLastDocId] = useState(null);

  const addUserProfile = () => {
    setUserProfiles([...userProfiles, ""]);
  };

  const updateUserProfile = (index, value) => {
    const updatedProfiles = [...userProfiles];
    updatedProfiles[index] = value;
    setUserProfiles(updatedProfiles);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(designGuide);
  };

  const callGPT4oAPI = async () => {
    if (!apiKey) {
      setDesignGuide("Please provide OpenAI API Key.");
      return;
    }

    setLoading(true);
    const userProfileText = userProfiles.join("\n");
    const fullPrompt = `AI Designer Role: ${designerRole}\n\nUser Profiles:\n${userProfileText}\n\nCustom Prompt:\n${customPrompt}\n\nPlease generate a design guide based on the above information.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "system", content: fullPrompt }],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0.2,
          presence_penalty: 0.3
        })
      });

      const data = await response.json();
      const outputText = data.choices[0]?.message?.content || "Generation failed, please check API request.";
      setDesignGuide(outputText);

      const docRef = await addDoc(collection(db, "gpt_interactions"), {
        timestamp: new Date().toISOString(),
        input: fullPrompt,
        output: outputText,
        notes: ""
      });

      setLastDocId(docRef.id);
    } catch (error) {
      console.error("❌ API 请求错误:", error);
      setDesignGuide("API request failed, please check network or API Key.");
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async () => {
    if (!lastDocId) {
      alert("❌ 请先生成 Design Guide 才能添加备注！");
      return;
    }
    try {
      await updateDoc(doc(db, "gpt_interactions", lastDocId), {
        notes: notes
      });

      alert("✅ 备注已存入数据库！");
    } catch (error) {
      console.error("❌ 备注存入失败:", error);
      alert("存入失败，请检查数据库连接！");
    }
  };

  return (
    <div className="app-container">
      <h1 className="page-title">Human-AI Collaborative Method for Future-Oriented Design Prompt System</h1>
      <div className="container">
        <div className="left-section">
          <h2>Designer Role</h2>
          <textarea
            placeholder="Enter AI designer role definition..."
            value={designerRole}
            onChange={(e) => setDesignerRole(e.target.value)}
          />
          <h2>User Profiles</h2>
          {userProfiles.map((profile, index) => (
            <textarea
              key={index}
              placeholder={`Enter User ${index + 1} information...`}
              value={profile}
              onChange={(e) => updateUserProfile(index, e.target.value)}
            />
          ))}
          <button className="full-width generate-button" onClick={addUserProfile}>Add User Profile</button>
          <h2>Custom Prompt</h2>
          <textarea
            placeholder="Enter custom Prompt..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
          <h2>OpenAI API Key</h2>
          <input
            type="password"
            placeholder="Enter your OpenAI API Key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button className="full-width generate-button" onClick={callGPT4oAPI} disabled={loading}>
            {loading ? "Generating..." : "Generate Design Guide"}
          </button>
        </div>

        <div className="right-section expanded">
          <h2 className="guide-header">
            Design Guide <span className="copy-text" onClick={copyToClipboard}>Copy</span>
          </h2>
          <textarea className="design-guide-box"
            readOnly
            value={designGuide}
            placeholder="The design guide will be generated here..."
          />

          <h2 className="notes-header">
            Notes <span className="copy-text" onClick={saveNotes}>Save</span>
          </h2>
          <textarea
            className="notes-box"
            placeholder="Enter your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      )}

      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            background: #121212;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .page-title {
            text-align: center;
            font-size: 18px;
            margin-top: 10px;
            color: #ffffff;
          }
          .container {
            display: flex;
            width: 90vw;
            height: 90vh;
            background: #1e1e1e;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
            overflow: hidden;
          }
          .left-section {
            width: 40%;
            display: flex;
            flex-direction: column;
            padding: 20px;
          }
          .right-section.expanded {
            width: 60%;
            display: flex;
            flex-direction: column;
            padding: 20px;
          }
          .design-guide-box {
            flex-grow: 1;
            min-height: 250px;
          }
          .notes-box {
            min-height: 50px; /* ✅ Notes 高度调整为 Design Guide 的 1/5 */
          }
          .full-width {
            width: 100%;
          }
          .generate-button {
            height: 40px;
            width: 100%;
            background: #bb86fc;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
          }
          .guide-header, .notes-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .copy-text {
            font-size: 14px;
            color: #ffffff;
            cursor: pointer;
            margin-left: 10px;
          }
          h2 {
            color: #bb86fc;
            font-size: 18px;
          }
          textarea, input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: none;
            border-radius: 5px;
            background: #333;
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}
export default App;
