'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [isDeveloper, setIsDeveloper] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const html = document.documentElement
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      html.setAttribute('data-theme', 'dark')
      html.style.setProperty('--bg-color', '#0d0d0d')
      html.style.setProperty('--text-color', '#fafafa')
      html.style.setProperty('--body-text-color', 'rgba(250, 250, 250, 0.8)')
    } else {
      html.style.setProperty('--bg-color', '#fafafa')
      html.style.setProperty('--text-color', '#0d0d0d')
      html.style.setProperty('--body-text-color', 'rgba(13, 13, 13, 0.8)')
    }
    
  }, [])

  useEffect(() => {
    // Update mode for selection styling whenever isDeveloper changes
    document.body.setAttribute('data-mode', isDeveloper ? 'developer' : 'designer')
  }, [isDeveloper])

  const toggleMode = () => {
    const newMode = !isDeveloper
    setIsDeveloper(newMode)
    
    // Update data attribute for selection styling
    document.body.setAttribute('data-mode', newMode ? 'developer' : 'designer')
  }

  const toggleTheme = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    const html = document.documentElement
    
    if (newTheme) {
      html.setAttribute('data-theme', 'dark')
      html.style.setProperty('--bg-color', '#0d0d0d')
      html.style.setProperty('--text-color', '#fafafa')
      html.style.setProperty('--body-text-color', 'rgba(250, 250, 250, 0.8)')
      localStorage.setItem('theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
      html.style.setProperty('--bg-color', '#fafafa')
      html.style.setProperty('--text-color', '#0d0d0d')
      html.style.setProperty('--body-text-color', 'rgba(13, 13, 13, 0.8)')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleMode()
    }
  }

  return (
    <div className="container">
      <div className="content-section">
        <h1>Ahmad Jamous is a <br></br> {isDeveloper ? 'Developer' : 'Designer'} based in <br></br> Toronto, Canada</h1>
        
        <div className="toggle-container">
          <div
            className={`toggle-switch ${isDeveloper ? 'developer' : 'designer'}`}
            onClick={toggleMode}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${isDeveloper ? 'Designer' : 'Developer'} mode`}
          >
            <div className="toggle-slider"></div>
          </div>
          <div className="action-buttons">
            {isDeveloper && (
              <button className="action-btn resume-btn">Resume</button>
            )}
            <a href="mailto:ajamous@uwaterloo.ca" target="_blank" rel="noopener noreferrer" className="action-btn contact-btn">Contact</a>
          </div>
        </div>
        
        <h2>About</h2>
        <p>
          As a Computer Engineering student at the University of Waterloo, and a Multimedia Designer for 4x NBA-All Star Karl-Anthony Towns, I combine strong analytical problem-solving with a passion for creating engaging visual experiences.
        </p>
        <p>
          I'm extremely inspired by Leonardo da Vinci. His ability to excel in every field and change the world is the versatility that I strive for every day.
        </p>
        <p>
          My work spans from developing AI-driven applications and embedded systems to designing professional-level multimedia content. With experience in both tech innovation and creative design, my goal is to continue to bridge the gap between engineering and visual design, providing solutions for complex problems.
        </p>

        <h2>Projects</h2>
        <ul>
          {isDeveloper ? (
            <>
              <li>MyType - Redefining the Creative Process through Typography</li>
              <li>Flickr - AI-Powered Penalty Predictor</li>
              <li>NBA Gameday Generator</li>
            </>
          ) : (
            <>
              <li>Siemens RPO Rebrand</li>
              <li>Minnesota Timberwolves Rebrand Concept</li>
              <li>World Cup Design Concepts</li>
            </>
          )}
        </ul>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
} 