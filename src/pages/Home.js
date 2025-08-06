import { LearningAppFascade } from "../model/LearningAppFascade";
import { LessonList } from "../model/LessonList";
import { Lesson } from "../model/Lesson";
import { useNavigate } from "react-router-dom";

function Home() {
    const learningAppFascade = LearningAppFascade.getInstance();
    const lessonList = LessonList.getInstance();
    const navigate = useNavigate();

    lessonList.getLessons().map((lesson) => (
      console.log(lesson.getQuestions().getQuestion())
    ))
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
        <body>
            <sidebar>
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
            </sidebar>
            <div className="video-screen">
                {lessonList.getLessons().map((lesson) => (
                    <img src={lesson.getThumbnailFileName()} alt="D1S1thumbnail" onClick={() => MoveToVideo(lesson)} style={{ cursor: 'pointer' }} draggable="false"/>
                ))}               
            </div>
        </body>
    </>
    )
}

export default Home;