
import React from 'react';
import QuizFormContainer, { QuizFormData } from './QuizFormContainer';

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit }) => {
  return <QuizFormContainer onSubmit={onSubmit} />;
};

export default QuizForm;
export type { QuizFormData };
