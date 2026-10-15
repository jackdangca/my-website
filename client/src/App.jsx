// PLACEHOLDER CLIENT
// Replace this whole "client" folder with your Assignment 1 client before
// submitting. This file exists only so `npm run dev` boots without errors.
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import EducationPage from './pages/EducationPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Backend not reachable'));
  }, []);

  return (
  <div className="flex min-h-screen flex-col bg-slate-soft text-slate-body">
      <Navbar />
      <main className="flex-1 px-4 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
