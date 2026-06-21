import { ArrowRight, BookOpen, Search, Bookmark, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing = () => {
  const features = [
    {
      title: 'Organized Resources',
      description: 'Everything categorized neatly by subject and type.',
      icon: BookOpen,
    },
    {
      title: 'Search',
      description: 'Find notes, PYQs, and cheat sheets in no time.',
      icon: Search,
    },
    {
      title: 'Bookmarks',
      description: 'Save important resources for quick access later.',
      icon: Bookmark,
    },
    {
      title: 'Quick Revision',
      description: 'Optimized for fast reading before exams.',
      icon: Zap,
    },
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cards border border-borders text-textSecondary text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-textSecondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-textSecondary"></span>
          </span>
          PrepNext MVP is Live
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-textPrimary mb-6">
          Stop Searching. <br className="hidden md:block" />
          <span className="text-textPrimary">Start Studying.</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-textSecondary mb-10 mx-auto">
          PrepNext helps students discover notes, PYQs, cheat sheets, and revision resources in one beautifully organized place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            to="/subjects"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            Browse Resources
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/upload"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 text-base font-medium text-textPrimary bg-surface border border-borders rounded-xl hover:bg-borders transition-all"
          >
            Upload Resource
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface border-y border-borders py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-textPrimary mb-4">Everything you need to prepare</h2>
            <p className="text-textSecondary text-lg">
              We eliminated the clutter so you can focus on what actually matters—getting good grades.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-background border border-borders rounded-2xl p-6 card-hover">
                  <div className="w-12 h-12 bg-cards rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-textPrimary" />
                  </div>
                  <h3 className="text-xl font-bold text-textPrimary mb-2">{feature.title}</h3>
                  <p className="text-textSecondary">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-textPrimary mb-4">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-borders"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-surface border-4 border-background rounded-full flex items-center justify-center text-2xl font-bold text-textPrimary mb-6 shadow-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Browse Resources</h3>
            <p className="text-textSecondary">Select your subject and find the material you need.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-surface border-4 border-background rounded-full flex items-center justify-center text-2xl font-bold text-textPrimary mb-6 shadow-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Save Important Material</h3>
            <p className="text-textSecondary">Bookmark resources to access them quickly before exams.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-surface border-4 border-background rounded-full flex items-center justify-center text-2xl font-bold text-textPrimary mb-6 shadow-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Prepare Faster</h3>
            <p className="text-textSecondary">Study efficiently without wasting time searching for notes.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-24 border-t border-borders mt-auto text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-textPrimary mb-6">Ready to upgrade your study game?</h2>
          <p className="text-xl text-textSecondary mb-10">Join thousands of students who prepare smarter with PrepNext.</p>
          <Link
            to="/dashboard"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
