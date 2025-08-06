import { LearningAppFascade } from "../model/LearningAppFascade";
import { LessonList } from "../model/LessonList";
import { Lesson } from "../model/Lesson";
import { useNavigate } from "react-router-dom";
import sidebarStyles from "../stylesheets/sidebar.module.css";
import videoGridStyles from "../stylesheets/videoGrid.module.css";

function Home() {
    const learningAppFascade = LearningAppFascade.getInstance();
    const lessonList = LessonList.getInstance();
    const navigate = useNavigate();

    const MoveToMainScreen = () => {

    }

    const ActivateChatbot = () => {
        
    }

    const LogOut = () => {
        learningAppFascade.logout();
        navigate("/");
    }
    

    const MoveToVideo = (lesson) => {
      const learningAppFascade = LearningAppFascade.getInstance();
      learningAppFascade.startNewLesson(lesson);
      navigate("/video");
    }


    return (
    <>
        <div className="body">
            <div className={sidebarStyles.sidebar}>
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
                <button name="signout_button" type="button" onClick={LogOut}>Sign Out</button>
            </div>
            <div className={videoGridStyles.videoGrid}>
                {lessonList.getLessons().map((lesson) => (
                    <img src={lesson.getThumbnailFileName()} alt="D1S1thumbnail" onClick={() => MoveToVideo(lesson)} style={{ cursor: 'pointer' }} draggable="false"/>
                ))}               
            </div>
        </div>
    </>
    )
}

export default Home;