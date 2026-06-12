import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import SubjectDetail from './pages/SubjectDetail'
import ResourceDetail from './pages/ResourceDetail'
import UploadResource from './pages/UploadResource'
import Bookmarks from './pages/Bookmarks'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
            <Route path="/resources/:resourceId" element={<ResourceDetail />} />
            <Route path="/upload" element={<UploadResource />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
