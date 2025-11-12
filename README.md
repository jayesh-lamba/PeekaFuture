Peekafuture - Your AI-Powered Career Guidance Ecosystem
React TypeScript Firebase Google Gemini Tailwind CSS

Peekafuture is a comprehensive, AI-powered career guidance platform designed to eliminate career-related anxiety for 10th-grade students in India. By leveraging the power of Google's Gemini AI, it provides a full suite of tools for personalized stream selection, academic planning, college exploration, and more, turning uncertainty into a clear, actionable plan for the future.

✨ Key Features
Peekafuture is more than just a guidance tool; it's an integrated ecosystem for academic and career planning.

Feature	Description
🔮 AI Stream Guidance	Take a personalized AI survey to discover your unique persona, ideal academic stream (Science, Commerce, Arts), and a top career recommendation tailored to your personality and interests.
🎭 "Day in the Life" Sim	Experience your potential future firsthand. Our AI generates an immersive narrative simulation of a day in your recommended career, making your choice tangible and exciting.
🗺️ Academic Navigator	Generate a custom 2-year roadmap for Grades 11 & 12. Track your progress with an interactive checklist and get AI-powered "deep dive" guides for any skill you want to master.
🎓 College Insights	Use natural language to find colleges (e.g., "Top private science colleges in Mumbai with fees under 10 lakhs"). Select up to three for a side-by-side comparison with an AI-generated summary.
🚀 Entrepreneurship Hub	Spark your inner founder. Get AI-generated startup ideas based on your degree and interests, then instantly draft a comprehensive one-page business plan, complete with a SWOT analysis.
📈 Future Trends Analysis	Stay ahead of the curve. Get a personalized report on the 5-10 year outlook for your chosen career, grounded with Google Search for the most up-to-date insights on required skills and opportunities.
📊 Live Market Insights	Get a real-time pulse on the job market for your recommended career. See up-to-date salary ranges, current demand levels, top hiring locations, and the key skills employers are looking for right now.
🎨 Artists' Corner	A dedicated space for creative minds. Generate a specialized roadmap for artistic careers and use the AI Grant & Scholarship Finder to discover funding for your projects.
🏆 Competition Finder	Discover relevant competitions, Olympiads, and hackathons based on your career path, with live results powered by Google Search to ensure you never miss an opportunity.
🛠️ Technology Stack & Architecture
Peekafuture is built on a modern, serverless architecture designed for scalability, performance, and a rich user experience.

Core Technologies
Frontend: React & TypeScript with Vite for a fast development experience.
Styling: Tailwind CSS for a utility-first, responsive design system.
Backend (BaaS): Firebase for:
Authentication: Secure user sign-up and login (Email/Password & Google OAuth).
Firestore: NoSQL database for storing core application data (colleges, streams, etc.).
AI Engine: Google Gemini API via the @google/genai SDK.
Gemini AI Usage
The application intelligently utilizes different Gemini models and features for optimal performance:

gemini-2.5-pro: Used for tasks requiring deep reasoning, creativity, and high-quality prose, such as the initial career guidance, business plan generation, future trends analysis, and live market insights.
gemini-2.5-flash: Leveraged for faster, more structured, or creative tasks like generating roadmaps, "Day in the Life" simulations, and quick summaries.
JSON Mode with Schema: Heavily used to ensure the AI's output is structured and reliable, allowing the frontend to parse and render complex data for roadmaps, search filters, business ideas, market analysis, and more flawlessly.
Google Search Grounding: A key feature for the Competition Finder, Art Grant Finder, Future Trends, and Live Market Insights tabs to provide users with current, verifiable information from the web, preventing outdated responses.
Architecture Overview
The application follows a simple yet powerful client-serverless model:

Client-Side SPA: The React application is a Single-Page Application that runs entirely in the user's browser. It manages all UI, state, and user interactions.
Firebase Integration: The client communicates directly with Firebase services for authentication and to fetch foundational data from Firestore.
Direct AI Communication: The client makes calls directly to the Gemini API using the official SDK. This simplifies the architecture by removing the need for an intermediary backend server for AI tasks.
+------------------+      +---------------------+      +---------------------+
|                  |      |                     |      |                     |
|   React Client   |----->| Firebase Services   |----->|      Firestore      |
| (Vite + TS)      |      | (Auth, Firestore)   |      |      Database       |
|                  |      |                     |      |                     |
+--------^---------+      +---------------------+      +---------------------+
         |
         |
         +-------------------------------------------->+   Google Gemini API   |
                                                       | (generateContent, etc.)|
                                                       +---------------------+
🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or later)
npm or yarn
1. Clone the Repository
git clone https://github.com/your-username/peekafuture.git
cd peekafuture
2. Install Dependencies
Install the required packages for the main application:

npm install
3. Set Up Environment Variables
You need a Google Gemini API key to run this project.

Obtain your API key from Google AI Studio.

Create a file named .env in the root of the project.

Add your API key to the .env file:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
4. Set Up Firebase
Go to the Firebase Console and create a new project.
In your project, create a new Web App.
Copy the firebaseConfig object provided.
Open src/services/firebase.ts and replace the placeholder firebaseConfig with your own.
Enable Authentication:
Go to the "Authentication" section in the Firebase Console.
Enable the "Email/Password" and "Google" sign-in providers.
Authorize Domain:
Under Authentication > Settings > Authorized domains, add localhost to allow local testing.
Set up Firestore:
Go to the "Firestore Database" section and create a new database in Test mode for easy setup.
5. Seed the Firestore Database
The application relies on initial data for colleges, streams, etc. A seeder script is provided to populate your Firestore instance.

Get Firebase Service Account Key:

In your Firebase project settings, go to the "Service accounts" tab.
Click "Generate new private key" and download the JSON file.
Rename the downloaded file to serviceAccountKey.json.
Move this file into the scripts/ directory.
Run the Seeder:

Navigate to the scripts directory, install its dependency, and run the script.
cd scripts
npm install
node seed.js
cd ..
This will safely populate your colleges, streams, entrepreneurship, and careers collections in Firestore.

6. Run the Application
Now you're ready to start the development server!

npm run dev
The application should now be running on http://localhost:3000.
