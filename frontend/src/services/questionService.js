import api from './api';

export const questionService = {
  getQuestionBanks: async (subjectId) => {
    const res = await api.get('/api/v1/questions/banks', {
      params: subjectId ? { subjectId } : {},
    });
    return res.data?.data || [];
  },

  getQuestions: async ({ questionBankId, skillId, difficulty } = {}) => {
    const params = {};
    if (questionBankId) params.questionBankId = questionBankId;
    if (skillId) params.skillId = skillId;
    if (difficulty) params.difficulty = difficulty;

    const res = await api.get('/api/v1/questions', { params });
    return res.data?.data || [];
  },

  getQuestion: async (id) => {
    const res = await api.get(`/api/v1/questions/${id}`);
    return res.data?.data;
  },

  checkAnswer: async (questionId, selectedOptionId) => {
    const res = await api.post(`/api/v1/questions/${questionId}/check-answer`, {
      selectedOptionId,
    });
    return res.data?.data;
  },
};

export default questionService;
