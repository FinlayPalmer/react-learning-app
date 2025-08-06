import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Start from "./pages/Start";
import Video from "./pages/Video";
import { LessonList } from './model/LessonList';
import { Lesson } from './model/Lesson';
import { useEffect, useState } from "react";
import './index.css';

export default function App() {
  const lessonList = LessonList.getInstance();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch('data/lessons.json')
        .then(res => res.json())
        .then(data => {
          // Convert JSON lessons to Lesson instances and add to LessonList
          data.forEach(item => {
            const lessonInstance = new Lesson(item);
            lessonList.addLesson(lessonInstance);
          });

          // Now get all lessons from LessonList to update React state
          setLessons(lessonList.getLessons());
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load lessons:", err);
          setLoading(false);
        });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

