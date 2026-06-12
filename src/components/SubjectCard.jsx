import { Library, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const SubjectCard = ({ subject, resourceCount }) => {
  return (
    <Link to={`/subjects/${subject.id}`} className="block group">
      <div className="bg-surface border border-borders rounded-xl p-6 card-hover h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-cards border border-borders rounded-xl">
            <Library className="w-6 h-6 text-textPrimary" />
          </div>
          <span className="text-xs font-medium bg-cards text-textSecondary px-2.5 py-1 rounded-full">
            {resourceCount} Resources
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-textPrimary mb-2 group-hover:text-textSecondary transition-colors">
          {subject.name}
        </h3>
        <p className="text-sm text-textSecondary mb-6 flex-grow">
          {subject.description}
        </p>
        
        <div className="flex items-center text-sm font-medium text-textPrimary mt-auto pt-4 border-t border-borders">
          Browse Materials
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

export default SubjectCard
