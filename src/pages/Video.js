import { LearningAppFascade } from "../model/LearningAppFascade";
import { useNavigate } from "react-router-dom";

function Video() {
  const learningAppFascade = LearningAppFascade.getInstance();
  const navigate = useNavigate();

  const MoveToMainScreen = () => {
    navigate("/home");
  }

  const ActivateChatbot = () => {
        
  }

  return (
    <div className="body">
      <div className="sidebar">
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
      </div>
      <h2>Watch this video:</h2>
      <video width="640" height="360" controls>
        <source src={learningAppFascade.getCurrentLesson().getVidFileName()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default Video;