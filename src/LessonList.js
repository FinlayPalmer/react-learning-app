class LessonList {
    #lessons;
    static #lessonList;

    constructor() {
        this.#lessons = [];
    }

    static getInstance() {
        if (!this.#lessonList) {
            this.#lessonList = new LessonList();
        }
        return this.#lessonList;
    }

    addLesson(title, questions, fileName) {

    }

    getLesson(title) {
        return new Lesson(title,"","files/vid/d1s1.mp4");
    }

    getListOfAllLesson() {

    }

    save() {
        
    }
}