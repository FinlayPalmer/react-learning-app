import { LearningAppFascade } from "../model/LearningAppFascade";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import videoContainerStyles from "../stylesheets/videoContainer.module.css";
import sidebarStyles from "../stylesheets/sidebar.module.css";
import questionStyles from "../stylesheets/question.module.css";
import { useLearningAppFascade } from "../useSingleton/useLearningAppFascade";

function Video() {
  const learningAppFascade = LearningAppFascade.getInstance();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { videoFileName, rawQuestions } = useLearningAppFascade();
  console.log('videoFileName:', videoFileName);
  const questions = rawQuestions || [];
  console.log('questions:', questions);
  const timestamps = questions.map(question => question.getTimeStamp());
  const [triggered, setTriggered] = useState(new Set());
  const [playQuestion, setPlayQuestion] = useState(null);

  const MoveToMainScreen = () => {
    navigate("/home");
  }

  const ActivateChatbot = () => {
        
  }

  const togglePlay = () => {
    const video = videoRef.current;
    setPlayQuestion(null);
    if (!video) return;
    setVideoPlaying(!videoPlaying);
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;

      timestamps.forEach((time) => {
        if (
          currentTime >= time && 
          !triggered.has(time)
        ) {
          video.pause();
          setPlayQuestion(learningAppFascade.getCurrentLesson().getQuestions()[0]);
          setTriggered(prev => new Set(prev).add(time));
        }
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [triggered, timestamps, videoFileName]);

  return (
    <div className="body">
      <div className={sidebarStyles.sidebar}>
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
      </div>
        {playQuestion ?
          <div className={videoContainerStyles.videoContainer}>
            <div className={questionStyles.questionContainer}>
              <p>{playQuestion.getQuestion()}</p>
            </div>
            <button onClick={togglePlay}>{"\u25B6"}</button>
          </div>
        :
          <div className={videoContainerStyles.videoContainer}>
            <video ref={videoRef} width="640" height="360" style={{ display: playQuestion ? "none" : "block" }} key={videoFileName}>
            <source src={videoFileName} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
            <button onClick={togglePlay}>{videoPlaying ? "\u23F8" : "\u25B6"}</button>
          </div>
        }    
    </div>
  )
}

export default Video;