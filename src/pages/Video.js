import { LearningAppFascade } from "../model/LearningAppFascade";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

function Video() {
  const learningAppFascade = LearningAppFascade.getInstance();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const MoveToMainScreen = () => {
    navigate("/home");
  }

  const ActivateChatbot = () => {
        
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoPlaying(!videoPlaying);
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  return (
    <div className="body">
      <div className="sidebar">
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
      </div>
      <h2>Watch this video:</h2>
      <video ref={videoRef} width="640" height="360">
        <source src={learningAppFascade.getCurrentLesson().getVidFileName()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
       <button onClick={togglePlay}>{videoPlaying ? "\u23F8" : "\u25B6"}</button>
      
    </div>
  )
}

export default Video;