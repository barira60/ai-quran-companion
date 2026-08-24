# 📖 AI Quran & Sunnah Companion (قرآن و سنت رہنمائی)

[![Live Website](https://img.shields.io/badge/Live_Website-ai--quran--companion.vercel.app-black?style=for-the-badge&logo=vercel)](https://ai-quran-companion.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

> A compassionate, authentic, and evidence-based Islamic AI companion that provides comforting spiritual guidance derived directly from the Holy Qur'an, authentic Hadith, and prophetic supplications.

🌐 **Live Demo**: **[https://ai-quran-companion.vercel.app](https://ai-quran-companion.vercel.app/)**

---

## ✨ Key Features

- **🌐 Bilingual Experience (English & Urdu)**:
  - Full support for both English and authentic Nastaliq Urdu typography.
  - Independent per-message language isolation — switching modes preserves previous conversation formatting.

- **📜 Short & Focused Qur'anic Verses**:
  - Live streamed Ayah cards with Uthmani Arabic script and verified translations (Saheeh International / Fateh Muhammad Jalandhry).
  - High-quality audio recitation by **Mishary Rashid Alafasy** synchronized with the displayed verse.

- **📚 Authentic Hadith & Verified Sunnah**:
  - Direct citations from primary collections (*Sahih al-Bukhari, Sahih Muslim, Jami' at-Tirmidhi, Sunan Abi Dawud, Sunan an-Nasa'i, Sunan Ibn Majah*).
  - Interactive direct badge buttons linking straight to the source on **[Sunnah.com](https://sunnah.com)** and **[Quran.com](https://quran.com)**.

- **🤲 Masnoon Duas (مسنون دعائیں)**:
  - Complete Arabic text with diacritics (*tashkeel*), roman transliteration, authentic meaning, and source citations.

- **🎯 Cohesive 3-Point Structure**:
  - Each response delivers structured, concise 3-point wisdom directly derived from the generated Ayah, Hadith, and Dua:
    1. **Why this helps / یہ کیوں مددگار ہے** *(3 concise points)*
    2. **Reflection / غور و فکر** *(3 concise points)*
    3. **Practical Steps / عملی اقدامات** *(3 Sunnah action steps)*
    4. **Reflect on this / غور فرمائیں** *(3 self-reflection questions)*

- **🌿 Healing Modes & Emotional Guidance**:
  - Dedicated focus areas for Grief, Anxiety, Gratitude, Overthinking, Relationship challenges, and Spiritual Peace.

- **⭐ Saved Favorites & Bookmarking**:
  - Save meaningful verses and supplications to your personal collection in `/favorites` for daily reflection.

- **🌓 Theme & Aesthetics**:
  - Modern glassmorphism UI with Dark and Light mode support, Islamic geometric accents, and smooth shimmer loaders.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing & SSR**: [TanStack Start & React Router](https://tanstack.com/router) + [Nitro](https://nitro.unjs.io/)
- **AI Engine**: Google Gemini API (`@google/genai` streaming with SSE)
- **Styling**: Tailwind CSS v4 + Radix UI + Lucide Icons
- **Quranic Data & Audio**: [AlQuran Cloud API](https://alquran.cloud/api) & Islamic Network CDN
- **Typography**: Jameel Noori Nastaleeq, Al Qalam Quran Majeed, Amiri, Inter

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/barira60/ai-quran-companion.git
cd ai-quran-companion
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY="your_google_gemini_api_key"
```

*(You can get a free API key from [Google AI Studio](https://aistudio.google.com/)).*

### 4. Run Locally

```bash
npm run dev
```

The application will be available at **`http://localhost:5173`** (or `http://localhost:3000`).

---

## ☁️ Deployment on Vercel

The live application is hosted on Vercel:
👉 **[https://ai-quran-companion.vercel.app](https://ai-quran-companion.vercel.app/)**

### Deploying Your Own Instance:
1. Push your repository to GitHub.
2. Import the project into **[Vercel](https://vercel.com/)**.
3. Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your_gemini_api_key`
4. Click **Deploy**. Vercel will automatically build and host the application.

---

## 📁 Project Structure

```
ai-quran-companion/
├── src/
│   ├── components/
│   │   ├── AppShell.tsx         # Layout wrapper, navigation & sidebar
│   │   ├── AyahCard.tsx         # Ayah presentation & audio player
│   │   ├── ChatWindow.tsx       # Conversation container & input composer
│   │   ├── MarkdownMessage.tsx  # Structured message & accordion parser
│   │   ├── LanguageToggle.tsx   # English / Urdu switcher
│   │   └── ThreadSidebar.tsx    # Conversation history & thread management
│   ├── lib/
│   │   ├── local-store.ts       # LocalStorage thread & favorites sync
│   │   ├── system-prompt.ts     # Islamic guidelines & prompt engineering
│   │   └── language-store.ts    # Global language state
│   ├── routes/
│   │   ├── _authenticated/
│   │   │   ├── chat.$threadId.tsx  # Dynamic thread route
│   │   │   ├── favorites.tsx       # Saved verses collection
│   │   │   └── healing.tsx         # Emotional category selector
│   │   └── api/
│   │       └── chat.ts             # Streaming API route with Gemini
│   └── styles.css               # Design system tokens & typography
├── public/                      # Static assets & Islamic fonts
└── package.json
```

---

## 🛡️ Religious Authenticity & Disclaimer

- All Qur'anic verses and Hadiths are sourced strictly from authentic platforms (**Quran.com** and **Sunnah.com**).
- This application provides spiritual comfort and educational guidance. It **does not issue fatwas** or legal rulings. For complex jurisprudence inquiries, users are advised to consult qualified Islamic scholars.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

