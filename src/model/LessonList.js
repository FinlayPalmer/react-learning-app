import { Lesson } from "./Lesson";

export class LessonList {
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

    addLesson(lesson) {
        this.#lessons.push(lesson)
    }

    getLesson(title) {
        return new Lesson(title,"","files/vid/d1s1.mp4");
    }

    getLessons() {
        return this.#lessons;
    }

    save() {
        
    }
}