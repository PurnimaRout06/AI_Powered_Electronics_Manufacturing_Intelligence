import { api, mockResolve, USE_MOCKS } from './api'
import { aiInsights, suggestedQuestions } from '../data/mockData'

// This module is the single integration point for the AI/LLM layer.
// Today it returns canned responses so the chat UI, insight cards, and
// equipment-detail insights can all be built and demoed. When the AI
// service is live behind Express, only askQuestion() needs to change —
// point it at POST /ai/ask and stream or return the real response in the
// same { answer, sections } shape used by the mock below.

const MOCK_RESPONSES = [
  {
    match: /production|output|decrease|yesterday/i,
    answer: {
      title: 'Production Insight',
      summary: 'Production output decreased by 8.4% yesterday.',
      sections: [
        {
          heading: 'Possible causes',
          type: 'list',
          items: [
            'Line 03 experienced 42 minutes of unplanned downtime.',
            'Equipment E-104 showed abnormal vibration.',
            'Quality rejection increased by 2.1%.'
          ]
        },
        {
          heading: 'Recommendation',
          type: 'text',
          content: 'Inspect E-104 and review Line 03 maintenance records.'
        }
      ]
    }
  },
  {
    match: /fail|risk|equipment/i,
    answer: {
      title: 'Equipment Risk Insight',
      summary: 'Equipment E-108 currently carries the highest failure risk on the floor.',
      sections: [
        {
          heading: 'Signals',
          type: 'list',
          items: [
            'Health score has dropped to 48, the lowest of any active unit.',
            'Vibration is running at 6.3, well above the 3.0 baseline.',
            'Last preventive maintenance was over 11 weeks ago.'
          ]
        },
        {
          heading: 'Recommendation',
          type: 'text',
          content: 'Schedule an inspection of E-108 before the next shift and review its maintenance interval.'
        }
      ]
    }
  },
  {
    match: /downtime/i,
    answer: {
      title: 'Downtime Insight',
      summary: 'Unplanned failures are the largest contributor to downtime this period.',
      sections: [
        {
          heading: 'Breakdown',
          type: 'list',
          items: [
            'Unplanned failures: 14.8 hrs',
            'Scheduled maintenance: 9.2 hrs',
            'Changeovers: 6.4 hrs'
          ]
        },
        {
          heading: 'Recommendation',
          type: 'text',
          content: 'Focus root-cause review on EQ-108 and EQ-104, which together account for over half of unplanned downtime.'
        }
      ]
    }
  },
  {
    match: /defect|quality/i,
    answer: {
      title: 'Quality Insight',
      summary: 'Line 03 has the highest defect rate of the four production lines.',
      sections: [
        {
          heading: 'Details',
          type: 'list',
          items: [
            'Line 03 quality rate is 92.4%, versus a 96.5% plant average.',
            'Dimensional defects are the largest category, at 42 units this week.'
          ]
        },
        {
          heading: 'Recommendation',
          type: 'text',
          content: 'Review tooling calibration on Line 03 and cross-check against EQ-104 vibration data.'
        }
      ]
    }
  },
  {
    match: /oee|improve/i,
    answer: {
      title: 'OEE Improvement Insight',
      summary: 'Availability losses are the biggest lever for improving OEE this month.',
      sections: [
        {
          heading: 'Opportunities',
          type: 'list',
          items: [
            'Reducing unplanned downtime on EQ-108 and EQ-104 could recover an estimated 2.1% OEE.',
            'Line 02 is already outperforming plant average and can be a benchmark for setup practices.'
          ]
        },
        {
          heading: 'Recommendation',
          type: 'text',
          content: 'Prioritize preventive maintenance on the two lowest health-score assets before addressing changeover time.'
        }
      ]
    }
  }
]

const DEFAULT_RESPONSE = {
  title: 'Manufacturing Insight',
  summary: "Here's what the data shows for that question.",
  sections: [
    {
      heading: 'Summary',
      type: 'text',
      content:
        'This is a placeholder response. Once connected to the AI/LLM layer, this will be generated from live production, equipment, and quality data.'
    }
  ]
}

export const aiService = {
  async getInsights() {
    if (USE_MOCKS) return mockResolve(aiInsights)
    return api.get('/ai/insights')
  },

  async getSuggestedQuestions() {
    if (USE_MOCKS) return mockResolve(suggestedQuestions)
    return api.get('/ai/suggested-questions')
  },

  async askQuestion(question) {
    if (USE_MOCKS) {
      const found = MOCK_RESPONSES.find((r) => r.match.test(question))
      return mockResolve(found ? found.answer : DEFAULT_RESPONSE, { delay: 650 })
    }
    return api.post('/ai/ask', { question })
  }
}
