# 📖 AI Quran & Sunnah Companion (قرآن و سنت رہنمائی)

> A compassionate, authentic, and evidence-based Islamic AI companion that provides comforting spiritual guidance derived directly from the Holy Qur'an, authentic Hadith, and prophetic supplications.

---

## ✨ Features

- **🌐 Bilingual Experience (English & Urdu)**:
  - Full support for both English and authentic Nastaliq Urdu typography.
  - Independent per-message language isolation so switching modes preserves previous conversation formatting.

- **📜 Short & Focused Qur'anic Verses**:
  - Live streamed Ayah cards with Uthmani Arabic script and verified translations (Saheeh International / Fateh Muhammad Jalandhry).
  - High-quality audio recitation by **Mishary Rashid Alafasy** in 100% sync with the displayed verse.

- **📚 Authentic Hadith & Verified Sunnah**:
  - Direct citations from primary collections (*Sahih al-Bukhari, Sahih Muslim, Jami' at-Tirmidhi, Sunan Abi Dawud, Sunan an-Nasa'i, Sunan Ibn Majah*).
  - Direct interactive buttons linking straight to the source on **[Sunnah.com](https://sunnah.com)** and **[Quran.com](https://quran.com)**.

- **🤲 Masnoon Duas (مسنون دعائیں)**:
  - Complete Arabic text with diacritics (*tashkeel*), roman transliteration, authentic meaning, and source citations.

- **🌿 Healing Modes & Emotional Guidance**:
  - Dedicated focus areas for Grief, Anxiety, Gratitude, Overthinking, Relationship challenges, and Spiritual Peace.

- **⭐ Saved Favorites & Bookmarking**:
  - Save meaningful verses and supplications to your personal collection in `/favorites` for daily reflection.

- **🌓 Theme & Aesthetics**:
  - Modern glassmorphism UI with Dark and Light mode support, Islamic geometric accents, and smooth shimmer loaders.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Start & React Router](https://tanstack.com/router)
- **AI Engine**: Google Gemini API (`@google/genai` streaming with SSE)
- **Styling**: Tailwind CSS + Radix UI + Lucide Icons
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

The application will be available at **`http://localhost:5173`**.

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
