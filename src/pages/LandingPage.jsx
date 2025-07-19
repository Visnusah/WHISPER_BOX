import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MessageCircle, Users, TrendingUp, Lock, Sparkles, ArrowRight, Star, Zap } from 'lucide-react'

function LandingPage() {
  const { user, isLoading } = useAuth()

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect logged-in users to appropriate dashboard
  if (user) {
    if (user.isAdmin) {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/home" replace />
    }
  }
  const features = [
    {
      icon: MessageCircle,
      title: 'Express Yourself',
      description: 'Share your thoughts with a beautiful, intuitive interface designed for meaningful expression.',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      icon: Users,
      title: 'Connect & Engage',
      description: 'Join vibrant discussions and connect with people who share your interests and passions.',
      gradient: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: TrendingUp,
      title: 'Discover Trends',
      description: 'Stay updated with trending topics and discover fresh perspectives from our community.',
      gradient: 'from-accent-500 to-accent-600'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Posts Shared' },
    { number: '100K+', label: 'Conversations' },
    { number: '99%', label: 'Satisfaction' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">WHISPER BOX</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn-primary group inline-flex items-center">
                Sign Up
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-100/20 to-blue-100/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4" />
                  <span>Join thousands of creators</span>
                </div>
                <h1 className="text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Whisper Box</span>
                  <br />
                  <span className="text-slate-800">Share your Thoughts</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  A beautiful platform where your thoughts matter. Connect, share, and discover 
                  meaningful conversations in a community that values authentic expression.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary group text-center inline-flex items-center justify-center">
                  Get Started Free
                  <Zap className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                </Link>
                <Link to="/login" className="btn-secondary text-center group inline-flex items-center justify-center">
                  Explore Posts
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.number}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Join the Community</h3>
                    <p className="text-slate-500">Start your journey today</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: MessageCircle, text: '💭 Share your thoughts and stories', color: 'text-indigo-600' },
                    { icon: Users, text: '👥 Join meaningful discussions', color: 'text-purple-600' },
                    { icon: TrendingUp, text: '🏷️ Discover content with tags', color: 'text-blue-600' },
                    { icon: Lock, text: '🤝 Connect with like-minded people', color: 'text-indigo-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="btn-accent w-full text-center group inline-flex items-center justify-center">
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 floating-element"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 floating-element" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Whisper Box</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the perfect blend of simplicity and powerful features designed 
              for meaningful conversations and genuine connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="feature-card animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className={`feature-icon bg-gradient-to-br ${feature.gradient}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Share Your Voice?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join our growing community of creators, thinkers, and storytellers. 
              Your thoughts deserve to be heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-indigo-700 font-semibold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-large hover:shadow-glow transform hover:-translate-y-1 group inline-flex items-center justify-center">
                Join Whisper Box
                <ArrowRight className="w-5 h-5 ml-2 inline transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-indigo-700 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold">WHISPER BOX</span>
              </div>
              <div className="space-y-2">
                <div className="text-red-400 font-semibold text-lg">
                  Community Guidelines
                </div>
                <p className="text-blue-300 leading-relaxed">
                  Share your thoughts freely, but let's keep our community respectful 
                  and welcoming for everyone. No controversial or harmful content.
                </p>
              </div>
            </div>
            
            <div className="text-right space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-slate-300 mb-2">Need help or have questions?</p>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors duration-300 group mr-6"
                  >
                    Contact Us
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
                <div>
                  <p className="text-slate-300 mb-2">Are you an admin?</p>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 group"
                  >
                    Admin Login
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                © 2024 Whisper Box. Made with ❤️ for creators.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage