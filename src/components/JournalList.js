import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Calendar, 
  Brain, 
  TrendingUp,
  Loader2,
  BookOpen
} from 'lucide-react';
import journalService from '../services/journalService';
import JournalEntryCard from './JournalEntryCard';

function JournalList() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterMood, setFilterMood] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadEntries();
  }, [currentUser]);

  useEffect(() => {
    filterAndSortEntries();
  }, [entries, searchTerm, filterSentiment, filterMood, sortBy]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const entriesData = await journalService.getEntries(currentUser.uid, 100);
      setEntries(entriesData);
    } catch (error) {
      setError('Failed to load journal entries');
      console.error('Entries loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEntries = () => {
    let filtered = [...entries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sentiment filter
    if (filterSentiment !== 'all') {
      filtered = filtered.filter(entry =>
        entry.sentiment?.toLowerCase() === filterSentiment.toLowerCase()
      );
    }

    // Mood filter
    if (filterMood !== 'all') {
      switch (filterMood) {
        case 'low':
          filtered = filtered.filter(entry => (entry.mood || 5) <= 4);
          break;
        case 'medium':
          filtered = filtered.filter(entry => (entry.mood || 5) > 4 && (entry.mood || 5) <= 7);
          break;
        case 'high':
          filtered = filtered.filter(entry => (entry.mood || 5) > 7);
          break;
        default:
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt?.toDate?.() - a.createdAt?.toDate?.() || 0;
        case 'mood':
          return (b.mood || 5) - (a.mood || 5);
        case 'sentiment':
          const sentimentOrder = { positive: 3, neutral: 2, negative: 1 };
          return (sentimentOrder[b.sentiment] || 0) - (sentimentOrder[a.sentiment] || 0);
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
  };

  const handleEntryDeleted = (entryId) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleEntryEdited = () => {
    loadEntries(); // Refresh the list
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSentiment('all');
    setFilterMood('all');
    setSortBy('date');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading entries...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <BookOpen className="h-12 w-12 mx-auto" />
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
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="input-field"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          {/* Mood Filter */}
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="input-field"
            >
              <option value="all">All Moods</option>
              <option value="low">Low (1-4)</option>
              <option value="medium">Medium (5-7)</option>
              <option value="high">High (8-10)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date">Date</option>
              <option value="mood">Mood</option>
              <option value="sentiment">Sentiment</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="btn-secondary whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Journal Entries
        </h2>
        <span className="text-gray-600 dark:text-gray-400">
          {filteredEntries.length} of {entries.length} entries
        </span>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {entries.length === 0 ? 'No entries yet' : 'No entries match your filters'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {entries.length === 0 
              ? 'Start writing to see your journal entries here!'
              : 'Try adjusting your search terms or filters.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onDelete={handleEntryDeleted}
              onEdit={handleEntryEdited}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default JournalList;
