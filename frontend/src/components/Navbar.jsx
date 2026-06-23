import { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Home, Library, Bookmark, Upload, Menu, X, LogOut, User, Sun, Moon, Flame, Search, Bot } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, protected: true },
    { name: 'Subjects', path: '/subjects', icon: Library, protected: false },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark, protected: true },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, protected: true },
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
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-2">
              {navLinks.map((link) => {
                if (link.protected && !user) return null
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    title={link.name}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                      isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-cards hover:text-textPrimary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-textSecondary" />
              </div>
              <input
                type="text"
                className="block w-48 lg:w-64 pl-10 pr-3 py-1.5 border border-borders rounded-lg leading-5 bg-cards text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Theme Toggle Button */}
            <div className="h-6 w-px bg-borders"></div>
            
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg text-textSecondary hover:bg-cards hover:text-textPrimary transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/upload"
                  title="Upload Resource"
                  className="p-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  <Upload className="w-5 h-5" />
                </Link>
                
                <div 
                  title={`${user.streak || 0} Day Streak`}
                  className={`flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-full border ${
                    (user.streak || 0) > 0 
                      ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-sm shadow-orange-500/10' 
                      : 'bg-cards text-textSecondary border-borders'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${(user.streak || 0) > 0 ? 'fill-orange-500' : ''}`} />
                  {user.streak || 0}
                </div>

                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-cards border border-borders text-textPrimary font-bold text-sm" title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-textSecondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
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

          {/* Mobile menu & Theme toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-textSecondary hover:bg-cards hover:text-textPrimary transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-textSecondary hover:text-textPrimary p-2 focus:outline-none"
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
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4 px-3">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-textSecondary" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-borders rounded-lg leading-5 bg-cards text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

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

                <div className={`flex items-center gap-3 px-3 py-3 mt-2 rounded-md text-base font-bold ${
                  (user.streak || 0) > 0 ? 'text-orange-500 bg-orange-500/10' : 'text-textSecondary bg-cards'
                }`}>
                  <Flame className={`w-5 h-5 ${(user.streak || 0) > 0 ? 'fill-orange-500' : ''}`} />
                  {user.streak || 0} Day Streak
                </div>

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
