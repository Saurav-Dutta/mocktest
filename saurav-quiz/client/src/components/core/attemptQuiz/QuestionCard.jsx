import React from 'react';

const QuestionCard = React.memo(({ question, onAnswerChange, userAnswers }) => {
  const selectedAnswer = userAnswers?.find(ans => ans.questionId === question._id)?.selectedOption;

  const handleOptionChange = (event) => {
    onAnswerChange(question._id, event.target.value);
  };

  return (
    <div className='border border-gray-300 bg-white w-full p-4 rounded-lg space-y-4'>
      <h3
        className='border-b pb-3 mb-3 border-gray-300 text-lg font-semibold text-black'
        dangerouslySetInnerHTML={{ __html: question.questionText }}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {question.options.map((option) => (
          <label
            key={option._id}
            className={`flex items-center gap-3 border-2 rounded-lg py-2 px-3 cursor-pointer transition-all
              ${
                selectedAnswer === option._id
                  ? 'border-green-500 bg-green-200'
                  : 'border-gray-600'
              }`}
          >
            <input
              type='radio'
              name={question._id}
              value={option._id}
              checked={selectedAnswer === option._id}
              onChange={handleOptionChange}
              className='accent-blue-500'
            />
            <div
              className='text-black'
              dangerouslySetInnerHTML={{ __html: option.text }}
            />
          </label>
        ))}
      </div>
    </div>
  );
});

export default QuestionCard;
