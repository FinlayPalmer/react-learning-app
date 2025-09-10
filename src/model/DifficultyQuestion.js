export class DifficultyQuestion {
  #question;
  #questionOptions;
  #questionDetailedCorrectAnswer;
  #difficulty;
  #tags;
  constructor(
    question,
    questionOptions,
    questionCorrectAnswer,
    questionDetailedCorrectAnswer,
    difficulty,
    tags
  ) {
    this.#question = question;
    this.#questionOptions = [];
    if (questionCorrectAnswer==="A"){
        this.#questionOptions.push(questionOptions[0]);
        this.#questionOptions.push(questionOptions[1]);
        this.#questionOptions.push(questionOptions[2]);
        this.#questionOptions.push(questionOptions[3]);
    } else if (questionCorrectAnswer==="B") {
        this.#questionOptions.push(questionOptions[1]);
        this.#questionOptions.push(questionOptions[0]);
        this.#questionOptions.push(questionOptions[2]);
        this.#questionOptions.push(questionOptions[3]);
    } else if (questionCorrectAnswer==="C") {
        this.#questionOptions.push(questionOptions[2]);
        this.#questionOptions.push(questionOptions[1]);
        this.#questionOptions.push(questionOptions[0]);
        this.#questionOptions.push(questionOptions[3]);
    } else {
        this.#questionOptions.push(questionOptions[3]);
        this.#questionOptions.push(questionOptions[1]);
        this.#questionOptions.push(questionOptions[2]);
        this.#questionOptions.push(questionOptions[0]);
    }
    this.#questionDetailedCorrectAnswer = questionDetailedCorrectAnswer;
    this.#difficulty = difficulty;
    this.#tags = tags;
  }

  getQuestion() {
    return this.#question;
  }

  getQuestionOptions() {
    return this.#questionOptions;
  }

  getDifficulty() {
    return this.#difficulty;
  }

  getDetailedCorrectAnswer() {
    return this.#questionDetailedCorrectAnswer;
  }
}
