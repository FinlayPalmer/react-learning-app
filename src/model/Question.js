export class Question {
    #question;
    #questionAnswers;
    #timeStamp;

    constructor(question, questionAnswers, timeStamp) {
        this.#question = question;
        this.#questionAnswers = questionAnswers;
        this.#timeStamp = timeStamp;
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
}