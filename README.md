# TastePulse - Discover Your Cultural Fingerprint

TastePulse is an AI-powered cultural recommendation app that helps users discover new experiences across multiple domains based on their unique taste profile. The app analyzes natural language input to extract taste preferences and provides personalized recommendations for music, food, books, travel, fashion, and more.

## Features

- **Natural Language Input**: Users can describe their preferences in their own words, in multiple languages including English, Bangla, and Spanish.
- **AI Taste Analysis**: Advanced AI parses user input to extract structured taste categories.
- **Cultural Recommendations**: Personalized recommendations across multiple cultural domains using the Qloo Taste Graph API.
- **Taste DNA Visualization**: Interactive visualization of the user's taste profile.
- **Profile Management**: Save and manage multiple taste profiles.
- **Similar Profiles**: Discover users with similar taste preferences.
- **Dark/Light Mode**: Beautiful UI with theme support.
- **Responsive Design**: Works seamlessly on mobile and desktop.

## Tech Stack

- **Frontend**: Vue 3, Vite, TailwindCSS
- **State Management**: Pinia
- **Backend**: Supabase (Auth, Database)
- **APIs**: Qloo API for recommendations, GPT/Gemini for taste parsing
- **Visualization**: Chart.js
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taste-pulse-app.git
   cd taste-pulse-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example` and add your API keys:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   # Standard Vite development server (uses mock API)
   npm run dev
   # or
   yarn dev
   
   # OR use Netlify Dev to test Edge Functions locally
   npm run netlify:dev
   # or
   yarn netlify:dev
   ```

5. Open your browser and navigate to `http://localhost:8080` (or the URL shown in your terminal)

## Project Structure

```
taste-pulse-app/
├── netlify/             # Netlify configuration
│   ├── edge-functions/  # Netlify Edge Functions
│   │   ├── parse-taste.js       # Gemini API integration
│   │   └── get-recommendations.js # Qloo API integration
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables (hooks)
│   ├── config/          # App configuration
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── utils/           # Utility functions
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   ├── main.js          # Entry point
│   └── style.css        # Global styles
├── .env.example         # Example environment variables
├── .env.development     # Development environment variables
├── index.html           # HTML template
├── netlify.toml         # Netlify configuration
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## Deployment

The app is configured for easy deployment to Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build` or `yarn build`
   - Publish directory: `dist`
4. Add your environment variables in the Netlify dashboard:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `QLOO_API_KEY` - Your Qloo API key
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
5. Deploy!

### Netlify Edge Functions

This app uses Netlify Edge Functions to securely handle API calls to Gemini and Qloo:

- `/api/parse-taste` - Processes natural language input using Google's Gemini API
- `/api/recommendations` - Fetches personalized recommendations from the Qloo API

Edge Functions run on Netlify's global network, keeping API keys secure and providing low-latency responses. To test them locally:

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Run the local development server with Edge Functions
npm run netlify:dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Qloo API](https://qloo.com/) for cultural recommendations
- [Supabase](https://supabase.io/) for backend services
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Vue.js](https://vuejs.org/) for the frontend framework