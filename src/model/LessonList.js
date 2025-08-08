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

    getLessonFromId(id) {
        console.log("start")
        console.log("lessons array:", this.#lessons);
        console.log("lessons length:", this.#lessons.length);
        for (const lesson of this.#lessons) {
            console.log(id);
            console.log(lesson.getId());
            if (lesson.getId().toString() === id.toString()) {
                console.log("lesson log loading: ", id);
                return lesson;
            }
        }
    }

    getLessons() {
        return this.#lessons;
    }

    save() {
        
    }
}