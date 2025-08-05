import { LearningAppFascade } from "../model/LearningAppFascade";
import { useEffect, useState } from "react";
import { LessonList } from "../model/LessonList";
import { Lesson } from "../model/Lesson";

function Home() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const learningAppFascade = LearningAppFascade.getInstance();
    const lessonList = LessonList.getInstance();

    console.log(lessonList.getLessons());

    useEffect(() => {
    fetch('data/lessons.json')
      .then(res => res.json())
      .then(data => {
        // Convert JSON lessons to Lesson instances and add to LessonList
        data.forEach(item => {
          const lessonInstance = new Lesson(item);
          lessonList.addLesson(lessonInstance);
        });

        // Now get all lessons from LessonList to update React state
        setLessons(lessonList.getLessons());
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load lessons:", err);
        setLoading(false);
      });
  }, []);
    const MoveToMainScreen = () => {

    }

    const ActivateChatbot = () => {
        
    }
    

    const MoveToVideo = (lessonName) => {
        const learningAppFascade = LearningAppFascade.getInstance();
        learningAppFascade.startNewLesson(lessonName);

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
                    <img src={lesson.getThumbnailFileName()} alt="D1S1thumbnail" onClick={() => MoveToVideo('d1s1')} style={{ cursor: 'pointer' }} draggable="false"/>
                ))}               
            </div>
        </body>
    </>
    )
}

export default Home;