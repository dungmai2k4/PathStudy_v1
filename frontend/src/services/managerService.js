import api from './api';

const managerService = {
  // --- Subject APIs ---
  getSubjects: async (grade) => {
    const params = grade ? { grade } : {};
    const response = await api.get('/api/v1/content/subjects', { params });
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

  // --- Module APIs ---
  getModulesBySubject: async (subjectId) => {
    const response = await api.get(`/api/v1/content/subjects/${subjectId}/modules`);
    return response.data.data;
  },

  createModule: async (data) => {
    const response = await api.post('/api/v1/content/modules', data);
    return response.data.data;
  },

  updateModule: async (id, data) => {
    const response = await api.put(`/api/v1/content/modules/${id}`, data);
    return response.data.data;
  },

  deleteModule: async (id) => {
    const response = await api.delete(`/api/v1/content/modules/${id}`);
    return response.data;
  },

  // --- Topic APIs ---
  getTopicsByModule: async (moduleId) => {
    const response = await api.get(`/api/v1/content/modules/${moduleId}/topics`);
    return response.data.data;
  },

  createTopic: async (data) => {
    const response = await api.post('/api/v1/content/topics', data);
    return response.data.data;
  },

  updateTopic: async (id, data) => {
    const response = await api.put(`/api/v1/content/topics/${id}`, data);
    return response.data.data;
  },

  deleteTopic: async (id) => {
    const response = await api.delete(`/api/v1/content/topics/${id}`);
    return response.data;
  },

  // --- Lesson APIs ---
  getLessonsByTopic: async (topicId) => {
    const response = await api.get(`/api/v1/content/topics/${topicId}/lessons`);
    return response.data.data;
  },

  // Legacy: get lessons by skill (kept for backward compatibility)
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

  // --- Skill APIs (Legacy - kept for backward compatibility) ---
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
