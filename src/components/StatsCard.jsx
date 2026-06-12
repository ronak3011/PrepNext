const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-surface border border-borders rounded-xl p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-textSecondary">{title}</h3>
        <div className="p-2 bg-cards border border-borders rounded-lg">
          <Icon className="w-5 h-5 text-textPrimary" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-textPrimary">{value}</div>
        {trend && (
          <div className="text-sm font-medium text-secondary">
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
