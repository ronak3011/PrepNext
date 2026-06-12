import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Home, Library, Bookmark, Upload, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Subjects', path: '/subjects', icon: Library },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-borders">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-cards border border-borders rounded-lg">
                <BookOpen className="w-6 h-6 text-textPrimary" />
              </div>
              <span className="text-xl font-bold text-textPrimary tracking-tight">PrepNext</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive(link.path) ? 'text-primary' : 'text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                )
              })}
            </div>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              <Upload className="w-4 h-4" />
              Upload Resource
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-textSecondary hover:text-textPrimary focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-borders fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-textSecondary hover:bg-cards hover:text-textPrimary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              )
            })}
            <Link
              to="/upload"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 mt-4 rounded-md text-base font-medium text-white bg-primary hover:bg-primary/90"
            >
              <Upload className="w-5 h-5" />
              Upload Resource
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
