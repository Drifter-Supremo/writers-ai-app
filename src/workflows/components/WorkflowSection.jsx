import React from 'react';
import QuestionCard from './QuestionCard'; // Assuming QuestionCard is in the same directory

const WorkflowSection = ({
  title,
  questions,
  answers,
  onAnswerChange,
  workflowId,
  projectId,
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gradient mb-6">{title}</h2>
      <div>
        {questions.map((questionConfig) => (
          <QuestionCard
            key={questionConfig.id}
            questionConfig={questionConfig}
            currentAnswer={answers?.[questionConfig.id] || ''}
            onAnswerChange={onAnswerChange}
            workflowId={workflowId}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowSection;