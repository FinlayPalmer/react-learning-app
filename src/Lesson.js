export class Lesson {
    #title;
    #questions;
    #currentQuestionNumber;
    #userScore;
    #fileName;

    constructor(title, questions, fileName) {
        this.#title = title;
        this.#questions = questions;
        this.#currentQuestionNumber = 0;
        this.#userScore = 0;
        this.#fileName = fileName;
    }

    getTitle() {
        return this.#title;
    }

    getQuestions() {
        return this.#questions;
    }

    getCurrentQuestion() {

    }

    getUserScore() {
        return this.#userScore;
    }

    getFileName() {
        return this.#fileName;
    }

    getLessonComplete() {

    }

    addQuestion(question) {
        this.#questions.push(question);
    }

    removeQuestion(question) {

    }

    moveToNextQuestion() {

    }

    moveToPrevQuestion() {

    }

    updateScore() {

    }

    startLesson() {

    }

    pauseLesson() {

    }

    unPauseLesson(timeStamp) {

    }

    endLesson() {
        
    }
}