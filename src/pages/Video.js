import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useLearningAppFascade } from "../useSingleton/useLearningAppFascade";
import sidebarStyles from "../stylesheets/sidebar.module.css";
import videoContainerStyles from "../stylesheets/videoContainer.module.css";
import QuestionCard from "../components/QuestionCard";

function Video() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [triggered, setTriggered] = useState(new Set());
  const [playQuestion, setPlayQuestion] = useState(null);
  const { videoFileName, questions, currentLesson } = useLearningAppFascade();
  const questionsChecked = questions || [];
  const timestamps = questionsChecked.map((question) =>
    question.getTimeStamp()
  );

  const MoveToMainScreen = () => {
    navigate("/home");
  };

  const ActivateChatbot = () => {};

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
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      timestamps.forEach((time) => {
        if (currentTime >= time && !triggered.has(time)) {
          video.pause();
          setPlayQuestion(currentLesson.getQuestions()[0]);
          setTriggered((prev) => new Set(prev).add(time));
        }
      });
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [triggered, timestamps, videoFileName, currentLesson]);

  return (
    <div className={sidebarStyles.body}>
      <div className={sidebarStyles.sidebar}>
        <button name="home_button" type="button" onClick={MoveToMainScreen}>
          Home
        </button>
        <button name="chatbot_button" type="button" onClick={ActivateChatbot}>
          Chatbot
        </button>
      </div>
      {playQuestion ? (
        <QuestionCard question={playQuestion} togglePlay={togglePlay} />
      ) : (
        <div className={videoContainerStyles.videoContainer}>
          <video
            ref={videoRef}
            width="640"
            height="360"
            style={{ display: playQuestion ? "none" : "block" }}
            key={videoFileName}
          >
            <source src={videoFileName} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button onClick={togglePlay}>
            {videoPlaying ? "\u23F8" : "\u25B6"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Video;
