import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dog, User, TrendingUp, Shield, MapPin, CreditCard, Star, Clock } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const handleRoleSelect = (role: 'owner' | 'walker') => {
    navigate('/register', { state: { role } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Dog className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                PetConnect
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Pet Care Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with trusted pet walkers in your area. Safe, reliable, and convenient.
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pet Owner Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Dog className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pet Owner</h2>
              <p className="text-gray-600 mb-6">
                Find trusted walkers and give your pets the exercise they deserve
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  Find walkers nearby
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  Book walks easily
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  Track pets in real-time
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  Rate and review walkers
                </li>
              </ul>
              <button
                onClick={() => handleRoleSelect('owner')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started as Owner
              </button>
            </motion.div>

            {/* Pet Walker Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-teal-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pet Walker</h2>
              <p className="text-gray-600 mb-6">
                Turn your love for pets into income with flexible working hours
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                  </div>
                  Earn money walking pets
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-teal-600" />
                  </div>
                  Flexible working hours
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-teal-600" />
                  </div>
                  Build your reputation
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-teal-600" />
                  </div>
                  Get paid via M-Pesa
                </li>
              </ul>
              <button
                onClick={() => handleRoleSelect('walker')}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started as Walker
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PetConnect?</h2>
            <p className="text-xl text-gray-600">Everything you need for professional pet care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Verified Walkers"
              description="All walkers are background-checked and verified for your peace of mind"
              color="purple"
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Live GPS Tracking"
              description="Track your pet's walk in real-time with our GPS tracking feature"
              color="blue"
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Secure Payments"
              description="Safe and convenient payments through M-Pesa integration"
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Dog className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PetConnect</span>
              </div>
              <p className="text-gray-400">Professional pet care services at your fingertips</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Pet Owners</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Walkers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Pet Walkers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Become a Walker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Earnings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Requirements</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li>
                  <Link to="/admin" className="hover:text-white transition-colors text-xs opacity-50">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PetConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'purple' | 'blue' | 'teal'
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    teal: 'from-teal-500 to-green-500',
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all"
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}
