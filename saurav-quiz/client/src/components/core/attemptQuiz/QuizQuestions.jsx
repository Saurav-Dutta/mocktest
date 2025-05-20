import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../Button';
import QuestionCard from './QuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { quizEndpoints } from "../../../services/APIs";
import { setUser } from "../../../slices/AuthSlice";

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const { token, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (quizDetails?.timer) {
      setRemainingTime(quizDetails.timer * 60);
    }
  }, [quizDetails]);

  useEffect(() => {
    let timer;
    if (quizStarted && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (quizStarted && remainingTime === 0) {
      clearInterval(timer);
      alert('Time is up!');
      submitQuiz();
    }
    return () => clearInterval(timer);
  }, [quizStarted, remainingTime]);

  const handleAnswerChange = useCallback((questionId, selectedOptionId) => {
    setUserAnswers(prevAnswers => {
      const existingIndex = prevAnswers.findIndex(ans => ans.questionId === questionId);
      if (existingIndex !== -1) {
        prevAnswers[existingIndex].selectedOption = selectedOptionId;
      } else {
        prevAnswers.push({ questionId, selectedOption: selectedOptionId });
      }
      return [...prevAnswers];
    });
  }, []);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const submitQuiz = async () => {
    try {
      const response = await apiConnector(
        'POST',
        `${quizEndpoints.ATTEMMP_QUIZ}/${quizDetails._id}/attempt`,
        {
          quizId: quizDetails._id,
          answers: userAnswers,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      dispatch(setUser({
        ...user,
        attemptedQuizzes: [...(user.attemptedQuizzes || []), quizDetails._id],
      }));
      navigate('/quiz-results', {
        state: {
          score: response.data.score,
          total: quizQuestions?.length,
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='flex py-5 border min-h-[70vh] px-5 justify-center items-start mt-5 rounded-lg bg-slate-900 border-slate-600'>
      {!quizStarted ? (
        <Button className='w-max self-center' onClick={startQuiz}>Start Test</Button>
      ) : (
        <div className='w-full flex flex-col'>
          <h2 className='border border-slate-600 py-2 px-3 rounded-lg text-center md:text-end'>
            Time Remaining:
            <span className='text-red-500 ml-2'>{formatTime(remainingTime)}</span>
          </h2>
          <div className='min-h-[50vh] space-y-5 mt-2'>
            {quizQuestions && quizQuestions.map((ques) => (
              <QuestionCard
                key={ques._id}
                question={ques}
                onAnswerChange={handleAnswerChange}
                userAnswers={userAnswers}
              />
            ))}
          </div>
          <Button className='w-max self-end mt-5' onClick={submitQuiz}>Submit</Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestions;
