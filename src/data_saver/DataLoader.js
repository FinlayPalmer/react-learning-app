import { LessonList } from '../model/LessonList';
import { Lesson } from '../model/Lesson';
import { Question } from '../model/Question';
import { useEffect, useState } from "react";
import { LearningAppFascade } from '../model/LearningAppFascade';

function DataLoader() {
  const lessonList = LessonList.getInstance();
  const [isInitializedReady, setIsInitializedReady] = useState(false);
  const learningAppFascade = LearningAppFascade.getInstance();

  // Run to Initialize data in App
  useEffect(() => {
    // Flag to prevent state update after component unmounts
    let ignore = false;

    const initializeData = async () => {
      try {
        const res = await fetch('data/lessons.json');
        const data = await res.json();

        // Only process data if the component is still mounted
        if (!ignore) {
          // Check if data is already loaded to prevent any race conditions
          if (lessonList.getLessons().length === 0) {
            data.forEach(item => {
              const questions = item.questions.map(jsonquestion => new Question(jsonquestion.question, jsonquestion.questionAnswers, jsonquestion.timeStamp));
              const lessonInstance = new Lesson(
                item.id,
                item.title,
                questions,
                item.thumbnailFileName,
                item.vidFidName
              );
              lessonList.addLesson(lessonInstance);
            });
          }
          setIsInitializedReady(true); // Moved inside to run after data is loaded
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);
        if(!ignore) {
            setIsInitializedReady(true); // Still signal readiness on error
        }
      }
    };

    initializeData();

    // Cleanup function: runs when the component unmounts
    return () => {
      ignore = true;
    };
  }, [lessonList]); // Added lessonList as a dependency

  /*
  // Run to Initialize data in App
  useEffect(() => {
        const response = fetch('data/lessons.json')
            .then(res => res.json())
            .then(data => {
            // Convert JSON lessons to Lesson instances and add to LessonList
            data.forEach(item => {
                const questions = item.questions.map(jsonquestion => new Question(jsonquestion.question, jsonquestion.questionAnswers, jsonquestion.timeStamp));
                const lessonInstance = new Lesson(
                item.id,
                item.title,
                questions,
                item.thumbnailFileName,
                item.vidFidName
                );
                lessonList.addLesson(lessonInstance);
            });
            })
            .catch(err => {
            console.error("Failed to load lessons:", err);
            });
        setIsInitializedReady(true);
    }, []);
    
    // Load saved lesson from localStorage on mount
  useEffect(() => {
    if (isInitializedReady) {
        const saved = localStorage.getItem("currentLesson");
        if (saved && saved !== "undefined") {
        console.log("Restoring saved lesson:", saved);
        learningAppFascade.resumeLesson(saved);
        }
    }
  }, [learningAppFascade]);

  // Save current lesson to localStorage on unload
  useEffect(() => {
    if (isInitializedReady) {
        const handleBeforeUnload = () => {
        const currentLesson = learningAppFascade.getCurrentLesson();
        if (currentLesson) {
            const id = currentLesson.getId();
            console.log("Saving current lesson:", id);
            localStorage.setItem("currentLesson", id);
        }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }
  }, [learningAppFascade]);*/

  return null;
}

export default DataLoader;