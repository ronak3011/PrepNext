import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = "Search resources..." }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-textSecondary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-borders rounded-xl leading-5 bg-surface text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar
