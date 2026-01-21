import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ModeProvider } from './contexts/ModeContext'
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import MyType from './pages/MyType'
import NBAGamedayGenerator from './pages/NBAGamedayGenerator'
import TinyCanvas from './pages/TinyCanvas'
import Graphics from './pages/Graphics'
import Illustrations from './pages/Illustrations'
import MotionGraphics from './pages/MotionGraphics'
import Videos from './pages/Videos'
import LogosBrands from './pages/LogosBrands'
import Misc from './pages/Misc'
import BulkUploadPage from './pages/BulkUpload'

function App() {
  return (
    <ModeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/mytype" element={<MyType />} />
              <Route path="/nba-gameday-generator" element={<NBAGamedayGenerator />} />
              <Route path="/tiny-canvas" element={<TinyCanvas />} />
              <Route path="/graphics" element={<Graphics />} />
              <Route path="/illustrations" element={<Illustrations />} />
              <Route path="/motion-graphics" element={<MotionGraphics />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/logos-brands" element={<LogosBrands />} />
              <Route path="/misc" element={<Misc />} />
              <Route path="/bulk-upload" element={<BulkUploadPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ModeProvider>
  )
}

export default App
