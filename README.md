


# 🧠 SmartClip - AI-powered Chrome Web Clipper

SmartClip is a Chrome Extension that allows users to:
- Select and clip text from any website
- Add personal notes to the selected text
- Generate AI-based summaries using Cohere API
- Save all clips securely in a MongoDB database
- View, manage, and delete saved clips from a clean React-based dashboard

---

## 📦 Features

- Clip and save selected text from web pages
- AI-generated summaries of clipped content
- Add optional notes before saving
- All data stored in MongoDB via a Node.js backend
- View all clips in a Tailwind CSS styled dashboard

---

## 🚀 How to Set Up and Use

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smartclip-extension.git
cd smartclip-extension
````

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
COHERE_API_KEY=your_cohere_api_key
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Then run the server:

```bash
node server.js
```

---

### 3. Setup Frontend (Chrome Extension)

Go back to the root folder:

```bash
cd ..
npm install
npm run build
```

> This builds the Chrome Extension into the `dist/` folder.

---

### 4. Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `dist/` folder
5. The extension is now ready to use

---

## 📂 Usage

* Select text on any web page
* Open the extension from the browser
* Add an optional note
* Click “🧠 Summarize” to generate an AI summary
* Click “💾 Save Clip” to store the clip
* Click “📂 View Saved Clips” to view all saved entries in a dashboard

---
## 📜 License

This project is licensed under the [MIT License](LICENSE).


