import React from 'react';
import { Navigate } from 'react-router-dom';

// Trang /subjects/english da duoc tich hop vao /study-path/english
export default function EnglishSubjectPage() {
  return <Navigate to="/study-path/english" replace />;
}
