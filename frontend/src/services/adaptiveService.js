import api from './api';

export const adaptiveService = {
  // Generate personalized study path based on assessment result.
  // Pass skillBreakdown directly from assessment result to guarantee correct differentiation!
  async generateStudyPath(subjectId, studentId, assessmentAttemptId, skillBreakdown = null) {
    const response = await api.post('/api/v1/adaptive/study-path/generate', {
      subjectId,
      studentId,
      assessmentAttemptId,
      skillBreakdown, // Direct payload → backend will sort by actual scores, not defaults
    });
    return response.data.data;
  },

  // Get list of subjects the student is actively enrolled in
  async getMySubjects(studentId) {
    const response = await api.get(`/api/v1/adaptive/study-path/my-subjects?studentId=${studentId}`);
    return response.data.data;
  },

  // Get active study path for a subject with nodes status
  async getMyStudyPath(studentId, subjectId) {
    const response = await api.get(
      `/api/v1/adaptive/study-path/my-path?studentId=${studentId}&subjectId=${subjectId}`
    );
    return response.data.data;
  },

  // Unlock next skill node when student passes skill test (>= 70%)
  async unlockNextSkill(studentId, subjectId, skillId) {
    const response = await api.post('/api/v1/adaptive/study-path/unlock-next-skill', {
      studentId,
      subjectId,
      skillId,
    });
    return response.data.data;
  },
};

export default adaptiveService;
