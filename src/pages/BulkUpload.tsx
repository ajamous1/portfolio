import { Link } from 'react-router-dom'
import BulkUpload from '../components/BulkUpload/BulkUpload'
import '../App.css'

function BulkUploadPage() {
  return (
    <div className="portfolio">
      <header className="portfolio-header portfolio-header-left">
        <Link to="/" className="back-link">← Back</Link>
        <h1 className="portfolio-name">Bulk Upload</h1>
      </header>

      <main className="portfolio-content">
        <section className="portfolio-section">
          <BulkUpload />
        </section>
      </main>
    </div>
  )
}

export default BulkUploadPage
