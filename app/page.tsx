'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Dither from './components/Backgrounds/Dither/Dither'

export default function Home() {
  const [isDeveloper, setIsDeveloper] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode
  const [isDitherReady, setIsDitherReady] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme')
    const html = document.documentElement
    
    if (savedTheme === 'light') {
      setIsDarkMode(false)
      html.setAttribute('data-theme', 'light')
    } else {
      setIsDarkMode(true)
      html.setAttribute('data-theme', 'dark')
    }
    
    // Update mode for selection styling
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
      localStorage.setItem('theme', 'dark')
    } else {
      html.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleMode()
    }
  }

  const handleDitherReady = () => {
    setIsDitherReady(true)
  }

  return (
    <>
      <div className="hero-section" style={{ opacity: isDitherReady ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        <div className="dither-container-wrapper">
          <Dither
            waveColor={isDeveloper ? [0.23, 0.53, 1.0] : [1.0, 0.37, 0.34]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={1.3}
            colorNum={4}
            waveAmplitude={0.5}
            waveFrequency={1.5}
            waveSpeed={0.05}
            onReady={handleDitherReady}
          />
        </div>
        <div className="hero-content">
          <h1>Ahmad Jamous is a <br></br> {isDeveloper ? 'Developer' : 'Designer'} based in <br></br> Toronto, Canada</h1>
        
          <div className="controls-group">
            <div className="toggle-anchor">
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
            </div>
            
            <div className="action-buttons">
              {isDeveloper ? (
                <button className="action-btn resume-btn">Resume</button>
              ) : (
                <button className="action-btn work-btn">Work</button>
              )}
              <a href="mailto:ajamous@uwaterloo.ca" target="_blank" rel="noopener noreferrer" className="action-btn contact-btn">Contact</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="content-section">
        
        <div className="about-section">
          <div className="about-content">
            <h2>About</h2>
            <p>
              As a Computer Engineering student at the University of Waterloo, and a Multimedia Designer for 4x NBA-All Star Karl-Anthony Towns, I combine strong analytical problem-solving with a passion for creating engaging visual experiences.
            </p>
            <p>
              I&apos;m extremely inspired by Leonardo da Vinci. His ability to excel in every field and change the world is the versatility that I strive for every day.
            </p>
            <p>
              My work spans from developing AI-driven applications and embedded systems to designing professional-level multimedia content. With experience in both tech innovation and creative design, my goal is to continue to bridge the gap between engineering and visual design, providing solutions for complex problems.
            </p>
          </div>
          <div className="about-image">
            <Image src="/images/davinci.png" alt="Leonardo da Vinci" width={300} height={300} />
          </div>
        </div>

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
    </>
  )
} 