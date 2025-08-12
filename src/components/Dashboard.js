import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Brain,
  Loader2 
} from 'lucide-react';
import journalService from '../services/journalService';
import JournalEntryCard from './JournalEntryCard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, entriesData] = await Promise.all([
        journalService.getEntryStats(currentUser.uid),
        journalService.getEntries(currentUser.uid, 5)
      ]);
      
      setStats(statsData);
      setRecentEntries(entriesData);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryDeleted = (entryId) => {
    setRecentEntries(prev => prev.filter(entry => entry.id !== entryId));
    loadDashboardData(); // Refresh stats
  };

  const handleEntryEdited = () => {
    loadDashboardData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <Brain className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={loadDashboardData}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Prepare chart data
  const moodData = {
    labels: ['1-3', '4-6', '7-8', '9-10'],
    datasets: [
      {
        label: 'Mood Distribution',
        data: [
          recentEntries.filter(e => e.mood >= 1 && e.mood <= 3).length,
          recentEntries.filter(e => e.mood >= 4 && e.mood <= 6).length,
          recentEntries.filter(e => e.mood >= 7 && e.mood <= 8).length,
          recentEntries.filter(e => e.mood >= 9 && e.mood <= 10).length,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const sentimentData = {
    labels: Object.keys(stats?.sentimentBreakdown || {}),
    datasets: [
      {
        data: Object.values(stats?.sentimentBreakdown || {}),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.totalEntries || 0}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Entries</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.averageMood || 5}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Average Mood</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-3">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.entriesThisWeek || 0}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">This Week</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-3">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.entriesThisMonth || 0}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">This Month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mood Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodData.datasets[0].data.map((value, index) => ({ 
              label: moodData.labels[index], 
              value 
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData.datasets[0].data.map((value, index) => ({
                  name: sentimentData.labels[index],
                  value
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {sentimentData.datasets[0].data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={sentimentData.datasets[0].backgroundColor[index]} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Entries
        </h3>
        
        {recentEntries.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No journal entries yet. Start writing to see your entries here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEntries.map((entry) => (
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
    </div>
  );
}

export default Dashboard;
