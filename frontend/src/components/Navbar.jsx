import { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Home, Library, Bookmark, Upload, Menu, X, LogOut, User } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, protected: true },
    { name: 'Subjects', path: '/subjects', icon: Library, protected: false },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark, protected: true },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

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
                if (link.protected && !user) return null
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
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/upload"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
                <div className="flex items-center gap-2 text-textSecondary text-sm font-medium">
                  <User className="w-4 h-4" />
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-textSecondary hover:text-red-500 transition-colors text-sm font-medium ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-textSecondary hover:text-textPrimary text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
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
              if (link.protected && !user) return null
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
            
            {user ? (
              <>
                <Link
                  to="/upload"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 mt-4 rounded-md text-base font-medium text-white bg-primary hover:bg-primary/90"
                >
                  <Upload className="w-5 h-5" />
                  Upload Resource
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 mt-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-3 py-3 rounded-md text-base font-medium text-textPrimary bg-cards border border-borders"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-3 py-3 rounded-md text-base font-medium text-white bg-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
