import { useState } from 'react'
import { Link } from 'react-router-dom'
import DrawingCanvas from '../components/DrawingCanvas/DrawingCanvas'
import Gallery from '../components/Gallery/Gallery'
import { saveDrawing } from '../utils/galleryStorage'
import '../App.css'

function TinyCanvas() {
  const [refreshGallery, setRefreshGallery] = useState(0)

  const handleSave = (imageData: string, authorName: string) => {
    const success = saveDrawing(imageData, authorName)
    if (success) {
      setRefreshGallery(prev => prev + 1)
    } else {
      alert('Gallery is full! The gallery resets at the end of each month.')
    }
  }

  return (
    <div className="portfolio">
      <header className="portfolio-header portfolio-header-left">
        <Link to="/" className="back-link">← Back</Link>
        <h1 className="portfolio-name">Tiny Canvas</h1>
      </header>

      <main className="portfolio-content">
        <section className="portfolio-section">
          <div className="project-layout">
            <div className="project-detail-card">
              <h2 className="section-title">MS Paint-style drawing tool on a chip using Tiny Tapeout</h2>
              <div className="project-detail-content">
                <p className="section-text">
                  Tiny Canvas is a hardware implementation of an MS Paint-style drawing application designed for the Tiny Tapeout ASIC project. This innovative project brings pixel art creation to silicon, interfacing with a SNES-compatible gamepad controller and communicating canvas state over I2C.
                </p>
                <p className="section-text">
                  The design occupies a single 1x1 tile and achieves approximately 87% utilization on the SKY130 process. Features include RGB color mixing, variable brush sizes, symmetry modes, fill rectangle functionality, and undo/redo capabilities—all implemented in hardware.
                </p>
                <p className="section-text">
                  Try the web version below and submit your drawings to the gallery!
                </p>
                <div className="project-link-container">
                  <a
                    href="https://github.com/ajamous1/tiny_tapeout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
            <div className="project-sidebar">
              <DrawingCanvas onSave={handleSave} />
            </div>
          </div>
          
          <div className="gallery-section">
            <Gallery key={refreshGallery} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default TinyCanvas
