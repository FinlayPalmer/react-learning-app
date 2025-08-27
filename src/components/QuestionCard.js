import questionStyles from "../stylesheets/question.module.css";
import videoContainerStyles from "../stylesheets/videoContainer.module.css";
import { useState } from "react";

function QuestionCard(props) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [correctClicked, setCorrectClicked] = useState(false);

  const answerQuestion = () => {
    setSubmitClicked(true);
    if (selectedAnswer === null || selectedAnswer !== props.question.getQuestionAnswers()[0]) {
      return;
    }
    setCorrectClicked(true);
  }

  return (
    <div className={videoContainerStyles.videoContainer}>
      {!submitClicked ? (
        <div className={questionStyles.questionContainer}>
          <p className={questionStyles.questionContainerTitle}>{props.question.getQuestion()}</p>
          <div className={questionStyles.questionOptions}>
            {props.question.getQuestionAnswers().map((questionAnswer) => (
              <p className={questionStyles.questionOption} onClick={() => setSelectedAnswer(questionAnswer)}>{questionAnswer}</p>
            ))}
          </div>
          <button onClick={answerQuestion}>{"\u21B5"}</button>
        </div>
      ) : (
        correctClicked ? (
          <div className={questionStyles.questionContainer}>
            <p className={questionStyles.questionContainerTitle}>Correct!</p>
            <p>Here's why: </p>
            <button onClick={props.togglePlay}>{"\u25B6"}</button>
          </div>
        ) : (
          <div className={questionStyles.questionContainer}>
            <p className={questionStyles.questionContainerTitle}>Incorrect!</p>
            <button>Let's figure out why</button>
            <button onClick={props.togglePlay}>{"\u25B6"}</button>
          </div>
        )
      )}
    </div>
  );
}

export default QuestionCard;
