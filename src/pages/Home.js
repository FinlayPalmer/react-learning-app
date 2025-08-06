import { LearningAppFascade } from "../model/LearningAppFascade";
import { LessonList } from "../model/LessonList";
import { Lesson } from "../model/Lesson";
import { useNavigate } from "react-router-dom";

function Home() {
    const learningAppFascade = LearningAppFascade.getInstance();
    const lessonList = LessonList.getInstance();
    const navigate = useNavigate();

    const MoveToMainScreen = () => {

    }

    const ActivateChatbot = () => {
        
    }
    

    const MoveToVideo = (lesson) => {
      const learningAppFascade = LearningAppFascade.getInstance();
      learningAppFascade.startNewLesson(lesson);
      navigate("/video");
    }


    return (
    <>
        <div className="body">
            <div className="sidebar">
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
            </div>
            <div className="video-screen">
                {lessonList.getLessons().map((lesson) => (
                    <img src={lesson.getThumbnailFileName()} alt="D1S1thumbnail" onClick={() => MoveToVideo(lesson)} style={{ cursor: 'pointer' }} draggable="false"/>
                ))}               
            </div>
        </div>
    </>
    )
}

export default Home;