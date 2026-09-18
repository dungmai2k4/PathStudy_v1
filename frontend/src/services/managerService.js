import api from './api';

const managerService = {
  // --- Subject APIs ---
  getSubjects: async () => {
    const response = await api.get('/api/v1/content/subjects');
    return response.data.data;
  },

  createSubject: async (data) => {
    const response = await api.post('/api/v1/content/subjects', data);
    return response.data.data;
  },

  updateSubject: async (id, data) => {
    const response = await api.put(`/api/v1/content/subjects/${id}`, data);
    return response.data.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/api/v1/content/subjects/${id}`);
    return response.data;
  },

  // --- Skill APIs ---
  getSkillsBySubject: async (subjectId) => {
    const response = await api.get(`/api/v1/content/subjects/${subjectId}/skills`);
    return response.data.data;
  },

  createSkill: async (data) => {
    const response = await api.post('/api/v1/content/skills', data);
    return response.data.data;
  },

  updateSkill: async (id, data) => {
    const response = await api.put(`/api/v1/content/skills/${id}`, data);
    return response.data.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`/api/v1/content/skills/${id}`);
    return response.data;
  },

  // --- Lesson APIs ---
  getLessonsBySkill: async (skillId) => {
    const response = await api.get(`/api/v1/content/skills/${skillId}/lessons`);
    return response.data.data;
  },

  createLesson: async (data) => {
    const response = await api.post('/api/v1/content/lessons', data);
    return response.data.data;
  },

  updateLesson: async (id, data) => {
    const response = await api.put(`/api/v1/content/lessons/${id}`, data);
    return response.data.data;
  },

  deleteLesson: async (id) => {
    const response = await api.delete(`/api/v1/content/lessons/${id}`);
    return response.data;
  },

  // --- Question Bank APIs ---
  getQuestionBanks: async (subjectId = null) => {
    const query = subjectId ? `?subjectId=${subjectId}` : '';
    const response = await api.get(`/api/v1/questions/banks${query}`);
    return response.data.data;
  },

  createQuestionBank: async (data) => {
    const response = await api.post('/api/v1/questions/banks', data);
    return response.data.data;
  },

  updateQuestionBank: async (id, data) => {
    const response = await api.put(`/api/v1/questions/banks/${id}`, data);
    return response.data.data;
  },

  deleteQuestionBank: async (id) => {
    const response = await api.delete(`/api/v1/questions/banks/${id}`);
    return response.data;
  },

  // --- Questions (Manager View with isCorrect) ---
  getQuestionsForManager: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.questionBankId) query.append('questionBankId', params.questionBankId);
    if (params.skillId) query.append('skillId', params.skillId);
    if (params.difficulty && params.difficulty !== 'ALL') query.append('difficulty', params.difficulty);

    const response = await api.get(`/api/v1/questions/manage?${query.toString()}`);
    return response.data.data;
  },

  createQuestion: async (data) => {
    const response = await api.post('/api/v1/questions', data);
    return response.data.data;
  },

  updateQuestion: async (id, data) => {
    const response = await api.put(`/api/v1/questions/${id}`, data);
    return response.data.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/api/v1/questions/${id}`);
    return response.data;
  },
};

export default managerService;
