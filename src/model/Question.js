export class Question {
    #question;
    #questionAnswers;
    #timeStamp;
    #userGotAnswerCorrect;
    #userAnswered;

    constructor(question, questionAnswers, timeStamp) {
        this.#question = question;
        this.#questionAnswers = questionAnswers;
        this.#timeStamp = timeStamp;
        this.#userGotAnswerCorrect = false;
        this.#userAnswered = false;
    }

    getQuestion() {
        return this.#question;
    }

    getQuestionAnswers() {
        return this.#questionAnswers;
    }

    getTimeStamp() {
        return this.#timeStamp;
    }

    getCorrectAnswer() {

    }

    isAnswerCorrect(answer) {
        
    }

    setUserGotAnswerCorrect(userGotAnswerCorrect) {
        this.#userGotAnswerCorrect = userGotAnswerCorrect;
    }

    getUserGotAnswerCorrect() {
        return this.#userGotAnswerCorrect;
    }

    setUserAnswered(userAnswered) {
        this.#userAnswered = userAnswered;
    }

    getUserAnswered() {
        return this.#userAnswered;
    }
}