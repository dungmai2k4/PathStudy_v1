import api from './api';

export const contentService = {
  getSubjects: async (grade) => {
    const params = grade ? { grade } : {};
    const res = await api.get('/api/v1/content/subjects', { params });
    return res.data?.data || [];
  },

  getSubject: async (id) => {
    const res = await api.get(`/api/v1/content/subjects/${id}`);
    return res.data?.data;
  },

  getSubjectByCode: async (code) => {
    const res = await api.get(`/api/v1/content/subjects/code/${code}`);
    return res.data?.data;
  },

  getSkills: async (subjectId) => {
    const res = await api.get(`/api/v1/content/subjects/${subjectId}/skills`);
    return res.data?.data || [];
  },

  getSkill: async (skillId) => {
    const res = await api.get(`/api/v1/content/skills/${skillId}`);
    return res.data?.data;
  },

  getLessons: async (skillId) => {
    const res = await api.get(`/api/v1/content/skills/${skillId}/lessons`);
    return res.data?.data || [];
  },

  getLesson: async (lessonId) => {
    const res = await api.get(`/api/v1/content/lessons/${lessonId}`);
    return res.data?.data;
  },

  getExamples: async (lessonId) => {
    const res = await api.get(`/api/v1/content/lessons/${lessonId}/examples`);
    return res.data?.data || [];
  },

  getMiniQuizzes: async (lessonId) => {
    const res = await api.get(`/api/v1/content/lessons/${lessonId}/mini-quizzes`);
    return res.data?.data || [];
  },

  getModules: async (subjectId) => {
    const res = await api.get(`/api/v1/content/subjects/${subjectId}/modules`);
    return res.data?.data || [];
  },

  getTopics: async (moduleId) => {
    const res = await api.get(`/api/v1/content/modules/${moduleId}/topics`);
    return res.data?.data || [];
  },

  getTopic: async (topicId) => {
    const res = await api.get(`/api/v1/content/topics/${topicId}`);
    return res.data?.data;
  },

  getTopicLessons: async (topicId) => {
    const res = await api.get(`/api/v1/content/topics/${topicId}/lessons`);
    return res.data?.data || [];
  },

  getRemedialLessons: async (topicId) => {
    const res = await api.get(`/api/v1/content/topics/${topicId}/remedial-lessons`);
    return res.data?.data || [];
  },
};

export default contentService;
