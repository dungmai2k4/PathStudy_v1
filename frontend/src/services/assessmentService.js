import api from './api';

export const assessmentService = {
  // Generate Placement Test with randomized questions across skills
  async generatePlacementTest(subjectId, studentId) {
    const response = await api.post('/api/v1/assessments/placement/generate', {
      subjectId,
      studentId,
    });
    return response.data.data;
  },

  // Generate Milestone Skill Test (1 min per question)
  async generateSkillTest(skillId, skillName, subjectId, studentId) {
    const response = await api.post('/api/v1/assessments/skill-test/generate', {
      skillId,
      skillName,
      subjectId,
      studentId,
    });
    return response.data.data;
  },

  // Submit test answers and get instant scoring report
  async submitAssessment(attemptId, answers) {
    const response = await api.post(`/api/v1/assessments/${attemptId}/submit`, {
      answers,
    });
    return response.data.data;
  },

  // Get specific attempt result
  async getAttemptResult(attemptId) {
    const response = await api.get(`/api/v1/assessments/attempts/${attemptId}/result`);
    return response.data.data;
  },

  // Get assessment history (all or by type)
  async getHistory(studentId, type = null) {
    const url = type
      ? `/api/v1/assessments/history?studentId=${studentId}&type=${type}`
      : `/api/v1/assessments/history?studentId=${studentId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  // Get history of test attempts for a specific skill (to compare results)
  async getSkillTestHistory(studentId, skillId) {
    const response = await api.get(
      `/api/v1/assessments/skill-test/history?studentId=${studentId}&skillId=${skillId}`
    );
    return response.data.data;
  },

  // Generate Topic Mastery Test (random questions from that topic)
  async generateTopicTest(topicId, topicName, subjectId, studentId) {
    const response = await api.post('/api/v1/assessments/topic-test/generate', {
      topicId,
      topicName,
      subjectId,
      studentId,
    });
    return response.data.data;
  },

  // Generate Course Final Test (15 random questions across all modules of subject)
  async generateCourseFinalTest(subjectId, studentId) {
    const response = await api.post('/api/v1/assessments/course-test/generate', {
      subjectId,
      studentId,
    });
    return response.data.data;
  },

  // Get history of Topic test attempts for a specific topic
  async getTopicTestHistory(studentId, topicId) {
    const response = await api.get(
      `/api/v1/assessments/history/topic?studentId=${studentId}&topicId=${topicId}`
    );
    return response.data.data || [];
  },

  // Get history of Course Final test attempts for a subject
  async getSubjectTestHistory(studentId, subjectId) {
    const response = await api.get(
      `/api/v1/assessments/history/subject?studentId=${studentId}&subjectId=${subjectId}`
    );
    return response.data.data || [];
  },
};

export default assessmentService;
