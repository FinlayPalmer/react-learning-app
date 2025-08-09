import { Lesson } from '../model/Lesson';
import { Question } from '../model/Question';
import { useEffect, useState } from "react";
import { useLearningAppFascade } from '../useSingleton/useLearningAppFascade';
import { useLessonList } from '../useSingleton/useLessonList';

function DataLoader() {
  const [isInitializedReady, setIsInitializedReady] = useState(false);
  const { resumeLesson, currentLesson } = useLearningAppFascade();
  const { addLesson, lessons } = useLessonList();

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
          if (lessons.length === 0) {
            data.forEach(item => {
              const questions = item.questions.map(jsonquestion => new Question(jsonquestion.question, jsonquestion.questionAnswers, jsonquestion.timeStamp));
              const lessonInstance = new Lesson(
                item.id,
                item.title,
                questions,
                item.thumbnailFileName,
                item.vidFidName
              );
              addLesson(lessonInstance);
            });
          }
          setIsInitializedReady(true); // Moved inside to run after data is loaded
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);
        if (!ignore) {
          setIsInitializedReady(true); // Still signal readiness on error
        }
      }
    };

    initializeData();

    // Cleanup function: runs when the component unmounts
    return () => {
      ignore = true;
    };
  }, [lessons]);

  // Load saved lesson from localStorage on mount
  useEffect(() => {
    if (isInitializedReady) {
      const saved = localStorage.getItem("currentLesson");
      if (saved && saved !== "undefined") {
        resumeLesson(saved);
      }
    }
  }, [isInitializedReady]);

  // Save current lesson to localStorage on unload
  useEffect(() => {
    if (isInitializedReady) {
      const handleBeforeUnload = () => {
        if (currentLesson) {
          const id = currentLesson.getId();
          localStorage.setItem("currentLesson", id);
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isInitializedReady, currentLesson]);

  return null;
}

export default DataLoader;