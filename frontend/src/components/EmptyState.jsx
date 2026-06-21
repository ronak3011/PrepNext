import { FolderOpen } from 'lucide-react'

const EmptyState = ({ title, description, icon: Icon = FolderOpen, action }) => {
  return (
    <div className="text-center py-16 px-4 bg-surface border border-borders rounded-xl flex flex-col items-center justify-center">
      <div className="p-4 bg-cards rounded-full mb-4">
        <Icon className="w-8 h-8 text-textSecondary" />
      </div>
      <h3 className="mt-2 text-lg font-semibold text-textPrimary">{title}</h3>
      <p className="mt-2 text-sm text-textSecondary max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
