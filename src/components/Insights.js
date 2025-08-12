import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import journalService from '../services/journalService';
import aiService from '../services/aiService';

function Insights() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntries();
  }, [currentUser]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const entriesData = await journalService.getEntries(currentUser.uid, 50);
      setEntries(entriesData);
      
      if (entriesData.length > 0) {
        generateInsights(entriesData);
      }
    } catch (error) {
      setError('Failed to load journal entries');
      console.error('Entries loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (entriesData = entries) => {
    if (entriesData.length === 0) {
      setInsights('No journal entries available for analysis.');
      return;
    }

    try {
      setGenerating(true);
      const aiInsights = await aiService.generateInsights(entriesData);
      setInsights(aiInsights);
    } catch (error) {
      setError('Failed to generate AI insights');
      console.error('Insights generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const refreshInsights = () => {
    generateInsights();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={loadEntries}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Brain className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover patterns and growth opportunities in your journaling
            </p>
          </div>
        </div>
        
        <button
          onClick={refreshInsights}
          disabled={generating}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          Refresh Insights
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {entries.length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Entries Analyzed</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-3">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {entries.filter(e => e.aiAnalysis).length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">AI Enhanced</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-3">
            <Lightbulb className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {entries.length > 0 ? Math.round(entries.length / 7) : 0}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Weeks of Data</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Growth Insights
          </h3>
        </div>

        {generating ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <span className="text-gray-600 dark:text-gray-400">
                AI is analyzing your journal entries...
              </span>
            </div>
          </div>
        ) : insights ? (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {insights}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No insights available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {entries.length === 0 
                ? 'Start writing journal entries to get AI insights!'
                : 'Click "Refresh Insights" to generate new analysis.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pattern Analysis */}
      {entries.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pattern Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Trends */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Mood Trends
              </h4>
              <div className="space-y-2">
                {(() => {
                  const moodRanges = [
                    { label: 'Very Low (1-3)', range: [1, 3], color: 'bg-red-500' },
                    { label: 'Low (4-5)', range: [4, 5], color: 'bg-orange-500' },
                    { label: 'Medium (6-7)', range: [6, 7], color: 'bg-yellow-500' },
                    { label: 'High (8-9)', range: [8, 9], color: 'bg-blue-500' },
                    { label: 'Very High (10)', range: [10, 10], color: 'bg-green-500' }
                  ];
                  
                  return moodRanges.map(({ label, range, color }) => {
                    const count = entries.filter(e => 
                      (e.mood || 5) >= range[0] && (e.mood || 5) <= range[1]
                    ).length;
                    const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                    
                    return (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${color}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Sentiment Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Sentiment Distribution
              </h4>
              <div className="space-y-2">
                {(() => {
                  const sentiments = ['positive', 'neutral', 'negative'];
                  const colors = ['bg-green-500', 'bg-gray-500', 'bg-red-500'];
                  
                  return sentiments.map((sentiment, index) => {
                    const count = entries.filter(e => 
                      e.sentiment?.toLowerCase() === sentiment
                    ).length;
                    const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                    
                    return (
                      <div key={sentiment} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {sentiment}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${colors[index]}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Recommendations
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-2">Based on your journaling patterns:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Continue journaling regularly to build better self-awareness</li>
                  <li>Focus on specific emotions and experiences for deeper insights</li>
                  <li>Review past entries to identify recurring themes</li>
                  <li>Use the mood tracking to understand emotional patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;
