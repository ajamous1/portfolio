import { Link } from 'react-router-dom'
import AssetGallery from '../components/AssetGallery/AssetGallery'
import '../App.css'

function MotionGraphics() {
  return (
    <div className="portfolio">
      <header className="portfolio-header portfolio-header-left">
        <Link to="/" className="back-link">← Back</Link>
        <h1 className="portfolio-name">Motion Graphics</h1>
      </header>

      <main className="portfolio-content">
        <section className="portfolio-section">
          <AssetGallery category="motion-graphics" preserveAspectRatio={true} />
        </section>
      </main>
    </div>
  )
}

export default MotionGraphics
