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

  // Unlock next skill/topic node when student passes test (>= 80%)
  async unlockNextSkill(studentId, subjectId, skillId, topicId = null) {
    const response = await api.post('/api/v1/adaptive/study-path/unlock-next-skill', {
      studentId,
      subjectId,
      skillId: skillId || topicId,
      topicId: topicId || skillId,
    });
    return response.data.data;
  },

  // Record lesson progress (completion status, quiz completed, quiz score)
  async recordLessonProgress(studentId, topicId, lessonId, isCompleted, quizCompleted = false, quizScore = 0) {
    const response = await api.post('/api/v1/adaptive/study-path/lesson-progress', {
      studentId,
      topicId,
      lessonId,
      isCompleted,
      quizCompleted,
      quizScore,
    });
    return response.data.data;
  },

  // Get student's lesson progress in a topic
  async getLessonProgress(studentId, topicId) {
    const response = await api.get(
      `/api/v1/adaptive/study-path/lesson-progress?studentId=${studentId}&topicId=${topicId}`
    );
    return response.data.data || [];
  },

  // Handle topic test failed (< 80%): activate remedial lessons
  async handleTopicTestFailed(studentId, subjectId, topicId, scorePercentage) {
    const response = await api.post('/api/v1/adaptive/study-path/topic-test/failed', {
      studentId,
      subjectId,
      topicId,
      scorePercentage,
    });
    return response.data.data;
  },

  // Complete course final test
  async completeCourseFinalTest(studentId, subjectId, scorePercentage) {
    const response = await api.post('/api/v1/adaptive/study-path/course-test/completed', {
      studentId,
      subjectId,
      scorePercentage,
    });
    return response.data.data;
  },
};

export default adaptiveService;
