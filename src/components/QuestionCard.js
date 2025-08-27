import questionStyles from "../stylesheets/question.module.css";
import videoContainerStyles from "../stylesheets/videoContainer.module.css";

function QuestionCard(props) {
  return (
    <div className={videoContainerStyles.videoContainer}>
      <div className={questionStyles.questionContainer}>
        <p className={questionStyles.questionContainerTitle}>
          {props.question.getQuestion()}
        </p>
        <div className={questionStyles.questionOptions}>
          {props.question.getQuestionAnswers().map((questionAnswer) => (
            <p className={questionStyles.questionOption}>{questionAnswer}</p>
          ))}
        </div>
      </div>
      <button onClick={props.togglePlay}>{"\u25B6"}</button>
    </div>
  );
}

export default QuestionCard;
