import { Account } from "./Account";
import { Lesson } from "./Lesson";
import { LessonList } from "./LessonList";
import { Question } from "./Question";

export class LearningAppFascade {
    static #learningAppFascade;
    #currentAccount;
    #currentLesson;

    constructor() {
        this.#currentAccount = new Account("", "", "", "", "");
        this.#currentLesson = new Lesson("","","");
    }

    static getInstance() {
        if (!this.#learningAppFascade) {
            this.#learningAppFascade = new LearningAppFascade();
        }
        return this.#learningAppFascade;
    }

    login(username, password){
        this.#currentAccount = new Account("firstName", "lastName", "email", username, password);
        return username;
    }

    logout() {

    }

    signUp(firstName, lastName, email, username, password) {
        this.#currentAccount = new Account(firstName, lastName, email, username, password);
    }

    viewAccountDetails() {
        return this.#currentAccount.getFirstName();
    }

    startNewLesson(lesson) {
        this.#currentLesson = lesson;
    }

    endLesson() {

    }
    
    resumeLesson(lessonId) {
        const lessonList = LessonList.getInstance();
        this.#currentLesson = lessonList.getLessonFromId(lessonId);
    }

    pauseLesson() {

    }

    answerQuestion(answer) {
        
    }

    getCurrentLesson() {
        return this.#currentLesson;
    }
}