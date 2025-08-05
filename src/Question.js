class Question {
    #question;
    #questionAnswers;

    constructor(question, questionAnswers) {
        this.#question = question;
        this.#questionAnswers = questionAnswers;
    }

    getQuestion() {
        return this.#question;
    }

    getQuestionAnswers() {
        return this.#questionAnswers;
    }

    getCorrectAnswer() {

    }

    isAnswerCorrect(answer) {
        
    }
}