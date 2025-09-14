import { useEffect, useState } from "react";
import { HybridLearner } from "../model/HybridLearner";

export function useHybridLearner() {
    const learningAppFascade = LearningAppFascade.getInstance();
    const [currentLesson, setCurrentLesson] = useState(learningAppFascade.getCurrentLesson());

    useEffect(() => {
        const handleChange = () => {
            setCurrentLesson(learningAppFascade.getCurrentLesson());
        };

        learningAppFascade.subscribe(handleChange);
        return () => learningAppFascade.unsubscribe(handleChange);
    }, []);

    return {
        currentLesson,
        videoFileName: currentLesson.getVidFileName(),
        questions: currentLesson.getQuestions(),
        summary: learningAppFascade.getSummary(),
        startNewLesson: (lesson) => learningAppFascade.startNewLesson(lesson),
        resumeLesson: (lessonId) => learningAppFascade.resumeLesson(lessonId),
        login: (username, password) => learningAppFascade.login(username, password),
        signUp: (firstName, lastName, email, username, password) => learningAppFascade.signUp(firstName, lastName, email, username, password),
        logout: () => learningAppFascade.logout()
    }
}