import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { 
  Mic, 
  MicOff, 
  Send, 
  Loader2, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import journalService from '../services/journalService';
import aiService from '../services/aiService';

function JournalEntryForm({ onEntryAdded }) {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setContent(transcript);
    }
  }, [transcript]);

  const startListening = () => {
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  const clearContent = () => {
    setContent('');
    resetTranscript();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content for your journal entry');
      return;
    }

    try {
      setError('');
      setIsAnalyzing(true);
      
      // Analyze the entry with AI
      const aiAnalysis = await aiService.analyzeJournalEntry(content);
      
      // Save to Firestore
      const newEntry = await journalService.addEntry(
        currentUser.uid,
        content,
        aiAnalysis
      );
      
      // Clear form and notify parent
      clearContent();
      onEntryAdded(newEntry);
      
    } catch (error) {
      setError('Failed to save journal entry. Please try again.');
      console.error('Entry submission error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="card">
        <div className="text-center p-4">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Voice input is not supported in your browser. Please use text input instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          New Journal Entry
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's on your mind today?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field min-h-[120px] resize-none"
            placeholder="Write about your thoughts, feelings, experiences, or anything you'd like to reflect on..."
            required
          />
        </div>

        {/* Voice Input Controls */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={isRecording ? stopListening : startListening}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
            disabled={listening && !isRecording}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isRecording ? 'Recording... Click to stop' : 'Click to start voice input'}
          </span>
          
          {listening && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 dark:text-red-400">Listening...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={clearContent}
            className="btn-secondary"
            disabled={!content.trim()}
          >
            Clear
          </button>
          
          <button
            type="submit"
            disabled={!content.trim() || isAnalyzing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing & Saving...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Save Entry
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Analysis Status */}
      {isAnalyzing && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-200 text-sm">
              AI is analyzing your entry and providing insights...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default JournalEntryForm;
