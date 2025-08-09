import { Account } from "./Account";
import { Lesson } from "./Lesson";
import { LessonList } from "./LessonList";
import { Question } from "./Question";

export class LearningAppFascade {
    static #learningAppFascade;
    #currentAccount;
    #currentLesson;
    #listeners = [];

    constructor() {
        this.#currentAccount = new Account("", "", "", "", "");
        this.#currentLesson = new Lesson("","","");
        this.#listeners = [];
    }

    static getInstance() {
        if (!this.#learningAppFascade) {
            this.#learningAppFascade = new LearningAppFascade();
        }
        return this.#learningAppFascade;
    }

    subscribe(listener) {
        this.#listeners.push(listener);
    }

    unsubscribe(listener) {
        this.#listeners = this.#listeners.filter(l => l !== listener);
    }

    notify() {
        this.#listeners.forEach(fn => fn());
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
        this.notify();
    }

    endLesson() {

    }
    
    resumeLesson(lessonId) {
        const lessonList = LessonList.getInstance();
        this.#currentLesson = lessonList.getLessonFromId(lessonId);
        this.notify();
    }

    pauseLesson() {

    }

    answerQuestion(answer) {
        
    }

    getCurrentLesson() {
        return this.#currentLesson;
    }
}