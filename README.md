# AI-Powered Personal Journal

A modern React application that combines personal journaling with AI-powered insights and analysis. Built with Firebase for authentication and data storage, integrated with xAI API for intelligent analysis, and featuring a beautiful dark mode interface.

## ✨ Features

- **🔐 User Authentication**: Secure Firebase-based user registration and login
- **📝 Journal Entries**: Rich text input with voice-to-text capabilities
- **🤖 AI Analysis**: xAI-powered sentiment analysis, mood scoring, and personal insights
- **📊 Dashboard**: Visual statistics and charts using Chart.js
- **🔍 Smart Search**: Filter and search through journal entries by sentiment, mood, and content
- **🌙 Dark Mode**: Beautiful dark/light theme toggle
- **📱 Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **🎤 Voice Input**: Speech recognition for hands-free journaling
- **📈 Insights**: AI-generated patterns and growth recommendations

## 🚀 Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Integration**: xAI API
- **Charts**: Chart.js with react-chartjs-2
- **Voice Recognition**: react-speech-recognition
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

- Node.js 16+ and npm
- Firebase project with Authentication and Firestore enabled
- xAI API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-personal-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id

   # xAI API Configuration
   REACT_APP_XAI_API_URL=https://api.x.ai/v1
   REACT_APP_XAI_API_KEY=your_xai_api_key_here
   ```

4. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your configuration from Project Settings

5. **Start the development server**
   ```bash
   npm start
   ```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard with charts
│   ├── Header.js        # Navigation header
│   ├── Insights.js      # AI insights and patterns
│   ├── JournalEntryForm.js # Entry creation form
│   ├── JournalEntryCard.js # Individual entry display
│   ├── JournalList.js   # List of all entries
│   ├── LoginForm.js     # User login
│   └── SignupForm.js    # User registration
├── contexts/            # React contexts
│   ├── AuthContext.js   # Firebase authentication
│   └── ThemeContext.js  # Dark mode management
├── services/            # API services
│   ├── aiService.js     # xAI API integration
│   └── journalService.js # Firestore operations
├── firebase/            # Firebase configuration
│   └── config.js        # Firebase setup
├── App.js               # Main application component
└── index.js             # Application entry point
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication with Email/Password provider
3. Create a Firestore database in test mode
4. Get your project configuration from Project Settings

### xAI API Setup
1. Sign up for xAI API access
2. Get your API key from the dashboard
3. Add the key to your environment variables

## 📱 Usage

### Creating Journal Entries
1. Navigate to "New Entry" in the sidebar
2. Write your thoughts or use voice input
3. Click "Save Entry" to analyze and save
4. AI will automatically analyze sentiment and provide insights

### Viewing Insights
1. Go to "AI Insights" to see patterns and recommendations
2. View mood trends and sentiment distribution
3. Get personalized growth suggestions

### Managing Entries
1. Use "All Entries" to browse and search your journal
2. Filter by sentiment, mood, or search terms
3. Edit or delete entries as needed

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for custom component styles
- Adjust color schemes in the theme context

### AI Analysis
- Customize prompts in `src/services/aiService.js`
- Modify analysis parameters for different insights
- Add new AI features as needed

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Environment Variables
Ensure all environment variables are set in your production environment or hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the Firebase documentation
- Review xAI API documentation
- Open an issue in the repository

## 🔮 Future Enhancements

- [ ] Export functionality (PDF, CSV)
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (goal tracking, habit analysis)
- [ ] Social features (shared insights, community)
- [ ] Integration with health apps
- [ ] Advanced analytics and reporting

---

Built with ❤️ using React, Firebase, and AI technology.
