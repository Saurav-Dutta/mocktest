import React from 'react';
import Button from '../../Button';

const QuestionCard = ({ question, deleteQuestionHandler }) => {
  return (
    <div>
      <div className='space-y-3 border border-slate-600 bg-slate-900 px-5 py-3 rounded-lg'>

        {/* Question Text */}
        <span className='flex justify-between gap-5 border-b pb-3 border-slate-600'>
          <h4
            className='text-xl font-semibold'
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          />
        </span>

        {/* Options */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {question.options.map((option, index) => (
            <div
              key={option._id || index}
              className={`${option.isCorrect ? 'border-green-900' : 'border-red-900'} border-2 rounded-lg py-1 px-3 text-sm md:text-base`}
            >
              <div dangerouslySetInnerHTML={{ __html: option.text }} />
            </div>
          ))}
        </div>

        {/* Delete Button */}
        <div className='flex justify-end py-3'>
          <Button
            onClick={() => deleteQuestionHandler(question)}
            className='w-max h-max'
            active={false}
          >
            Delete
          </Button>
        </div>

      </div>
    </div>
  );
};

export default QuestionCard;
