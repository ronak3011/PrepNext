import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-borders mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-textPrimary" />
            <span className="text-lg font-bold text-textPrimary">PrepNext</span>
          </div>
          
          <div className="text-sm text-textSecondary">
            &copy; {new Date().getFullYear()} PrepNext. All rights reserved.
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
