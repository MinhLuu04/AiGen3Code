import axios from 'axios';

const XAI_API_URL = process.env.REACT_APP_XAI_API_URL || 'https://api.x.ai/v1';
const XAI_API_KEY = process.env.REACT_APP_XAI_API_KEY;

class AIService {
  constructor() {
    this.api = axios.create({
      baseURL: XAI_API_URL,
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async analyzeJournalEntry(content) {
    try {
      const prompt = `Analyze the following journal entry and provide:
1. Sentiment analysis (positive, negative, neutral)
2. Emotional state assessment
3. Key themes and topics
4. Personal growth insights
5. Suggestions for reflection or action
6. Mood score (1-10, where 1 is very negative and 10 is very positive)

Journal entry: "${content}"

Please provide a structured analysis in JSON format.`;

      const response = await this.api.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI personal development coach analyzing journal entries to provide insights and guidance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      // Parse the AI response
      const aiResponse = response.data.choices[0].message.content;
      
      try {
        // Try to parse as JSON
        return JSON.parse(aiResponse);
      } catch (parseError) {
        // If parsing fails, return a structured response
        return {
          sentiment: 'neutral',
          emotionalState: 'mixed',
          themes: ['personal reflection'],
          insights: 'AI analysis completed',
          suggestions: ['Continue journaling regularly'],
          moodScore: 5,
          rawResponse: aiResponse
        };
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error('Failed to analyze journal entry');
    }
  }

  async generateInsights(entries) {
    try {
      const prompt = `Based on these journal entries, provide:
1. Overall emotional trend
2. Recurring themes
3. Personal growth patterns
4. Recommendations for future journaling
5. Areas of focus for personal development

Entries: ${entries.map(entry => entry.content).join('\n\n')}`;

      const response = await this.api.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI personal development coach providing insights from multiple journal entries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI insights generation error:', error);
      throw new Error('Failed to generate insights');
    }
  }
}

export default new AIService();
