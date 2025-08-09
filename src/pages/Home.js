import { useNavigate } from "react-router-dom";
import { useLessonList } from "../useSingleton/useLessonList";
import { useLearningAppFascade } from "../useSingleton/useLearningAppFascade";
import sidebarStyles from "../stylesheets/sidebar.module.css";
import videoGridStyles from "../stylesheets/videoGrid.module.css";

function Home() {
    const { lessons } = useLessonList();
    const { logout, startNewLesson } = useLearningAppFascade();
    const navigate = useNavigate();

    const MoveToMainScreen = () => {

    }

    const ActivateChatbot = () => {

    }

    const LogOut = () => {
        logout();
        navigate("/");
    }


    const MoveToVideo = (lesson) => {
        startNewLesson(lesson);
        navigate("/video");
    }


    return (
        <div className="body">
            <div className={sidebarStyles.sidebar}>
                <button name="home_button" type="button" onClick={MoveToMainScreen}>Home</button>
                <button name="chatbot_button" type="button" onClick={ActivateChatbot}>Chatbot</button>
                <button name="signout_button" type="button" onClick={LogOut}>Sign Out</button>
            </div>
            <div className={videoGridStyles.videoGrid}>
                {lessons.map((lesson) => (
                    <img src={lesson.getThumbnailFileName()} alt="D1S1thumbnail" onClick={() => MoveToVideo(lesson)} style={{ cursor: 'pointer' }} draggable="false" key={lesson.getThumbnailFileName()} />
                ))}
            </div>
        </div>
    )
}

export default Home;