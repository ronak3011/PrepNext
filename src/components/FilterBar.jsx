const FilterBar = ({ types, selectedType, onSelectType }) => {
  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
      <button
        onClick={() => onSelectType('All')}
        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedType === 'All'
            ? 'bg-primary text-white shadow-sm shadow-primary/20'
            : 'bg-surface text-textSecondary border border-borders hover:border-textSecondary hover:text-textPrimary'
        }`}
      >
        All
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === type
              ? 'bg-primary text-white shadow-sm shadow-primary/20'
              : 'bg-surface text-textSecondary border border-borders hover:border-textSecondary hover:text-textPrimary'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
