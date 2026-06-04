# 🏛️ Holosight

An AI-powered web application that turns any travel photo into an immersive, interactive AR Tour Guide. Built with React, Tailwind CSS, and Google's Gemini Vision API.

## ✨ Features

* 📸 **AI Landmark Recognition:** Upload a photo and let Gemini identify the landmark, city, and country.
* 🎧 **Audio Narration:** Cinematic, tour-guide style audio monologues based on identified landmarks.
* 🌐 **Multilingual Support:** Enjoy tours in English, Sinhala, French, Spanish, and Japanese.
* 🎯 **AR-Style Anchors:** Discover specific points of interest within the photo with smart coordinate mapping.
* 🧭 **Nearby Recommendations:** AI-generated suggestions for nearby cafes, museums, and parks.
* 🏅 **Gamification:** Earn and collect badges for every new landmark you discover.
* 🎫 **Digital Souvenirs:** Generate highly stylized, downloadable souvenir cards of your visits.
* 📤 **Social Sharing:** Easily tweet or share your waypoint discoveries with friends.

## 🚀 Tech Stack

* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
* **Backend:** Node.js, Express
* **AI Engine:** Google Gemini API (Gemini 1.5 Pro / Flash)

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18 or higher)
* NPM or Yarn
* A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/holosight.git
   cd holosight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your API credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the application (Development):**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

5. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

## 📱 Usage

1. Open the app on your device.
2. Click **Start AR Scanner** to grant camera access or click **Upload Gallery** to choose an existing photo.
3. The AI will scan the image and generate an interactive dashboard.
4. Explore the AR Guide tab, check out the Nearby Recommendations, collect your Badge, and generate a Digital Souvenir!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License.
