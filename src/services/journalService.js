import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  doc, 
  deleteDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

class JournalService {
  constructor() {
    this.collectionName = 'journal_entries';
  }

  async addEntry(userId, content, aiAnalysis = null) {
    try {
      const entry = {
        userId,
        content,
        aiAnalysis,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        tags: [],
        mood: aiAnalysis?.moodScore || 5,
        sentiment: aiAnalysis?.sentiment || 'neutral'
      };

      const docRef = await addDoc(collection(db, this.collectionName), entry);
      return { id: docRef.id, ...entry };
    } catch (error) {
      console.error('Error adding journal entry:', error);
      throw new Error('Failed to add journal entry');
    }
  }

  async getEntries(userId, limit = 50) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const entries = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return entries.slice(0, limit);
    } catch (error) {
      console.error('Error getting journal entries:', error);
      throw new Error('Failed to get journal entries');
    }
  }

  async updateEntry(entryId, updates) {
    try {
      const entryRef = doc(db, this.collectionName, entryId);
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw new Error('Failed to update journal entry');
    }
  }

  async deleteEntry(entryId) {
    try {
      await deleteDoc(doc(db, this.collectionName, entryId));
      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw new Error('Failed to delete journal entry');
    }
  }

  async getEntryStats(userId) {
    try {
      const entries = await this.getEntries(userId, 1000);
      
      if (entries.length === 0) {
        return {
          totalEntries: 0,
          averageMood: 5,
          sentimentBreakdown: { positive: 0, negative: 0, neutral: 0 },
          entriesThisWeek: 0,
          entriesThisMonth: 0
        };
      }

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const entriesThisWeek = entries.filter(entry => 
        entry.createdAt?.toDate() > weekAgo
      ).length;

      const entriesThisMonth = entries.filter(entry => 
        entry.createdAt?.toDate() > monthAgo
      ).length;

      const totalMood = entries.reduce((sum, entry) => sum + (entry.mood || 5), 0);
      const averageMood = totalMood / entries.length;

      const sentimentBreakdown = entries.reduce((acc, entry) => {
        const sentiment = entry.sentiment || 'neutral';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {});

      return {
        totalEntries: entries.length,
        averageMood: Math.round(averageMood * 10) / 10,
        sentimentBreakdown,
        entriesThisWeek,
        entriesThisMonth
      };
    } catch (error) {
      console.error('Error getting entry stats:', error);
      throw new Error('Failed to get entry statistics');
    }
  }
}

export default new JournalService();
