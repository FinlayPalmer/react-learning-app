export class Lesson {
    #title;
    #questions;
    #currentQuestionNumber;
    #userScore;
    #thumbnailFileName;
    #vidFileName;
    #id;

    constructor(id, title, questions, thumbnailFileName, vidFidName) {
        this.#id = id;
        this.#title = title;
        this.#questions = questions;
        this.#currentQuestionNumber = 0;
        this.#userScore = 0;
        this.#thumbnailFileName = thumbnailFileName;
        this.#vidFileName = vidFidName;
    }

    getId() {
        return this.#id;
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

    getThumbnailFileName() {
        return this.#thumbnailFileName;
    }

    getVidFileName() {
        return this.#vidFileName;
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