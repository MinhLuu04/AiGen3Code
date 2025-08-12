import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Trash2,
  Edit3
} from 'lucide-react';

function JournalEntryCard({ entry, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getMoodColor = (mood) => {
    if (mood >= 8) return 'text-green-600 dark:text-green-400';
    if (mood >= 6) return 'text-blue-600 dark:text-blue-400';
    if (mood >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await onDelete(entry.id);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(entry.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{formatTime(entry.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Edit entry"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
            title="Delete entry"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center space-x-4 mb-4 text-sm">
        {entry.aiAnalysis && (
          <>
            <div className="flex items-center space-x-1">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className={getSentimentColor(entry.sentiment)}>
                {entry.sentiment || 'neutral'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className={getMoodColor(entry.mood)}>
                Mood: {entry.mood || 5}/10
              </span>
            </div>
          </>
        )}
      </div>

      {/* AI Analysis Toggle */}
      {entry.aiAnalysis && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="font-medium">AI Insights</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* AI Analysis Details */}
          {showDetails && (
            <div className="mt-4 space-y-3 animate-fade-in">
              {entry.aiAnalysis.themes && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.aiAnalysis.themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.aiAnalysis.insights && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Personal Insights</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {entry.aiAnalysis.insights}
                  </p>
                </div>
              )}

              {entry.aiAnalysis.suggestions && entry.aiAnalysis.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggestions</h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    {entry.aiAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.aiAnalysis.emotionalState && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Emotional State</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {entry.aiAnalysis.emotionalState}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JournalEntryCard;
