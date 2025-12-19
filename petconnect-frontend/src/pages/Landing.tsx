import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dog, MapPin, Shield, Heart, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                                <Dog className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">PetConnect</span>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Walking tails, <br />
                            <span className="text-brand">happy</span> <span className="text-leaf-dark">trails.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            The most trusted dog walking app in your neighborhood.
                            Connect with verified walkers who love your pet as much as you do.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">Become a Walker</Button>
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                        className="w-8 h-8 rounded-full border-2 border-white"
                                    />
                                ))}
                            </div>
                            <p>Trusted by 10,000+ pet lovers</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-brand/10 rounded-full blur-3xl transform rotate-6"></div>
                        <img
                            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2070&auto=format&fit=crop"
                            alt="Happy dog walking"
                            className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-brand rounded-3xl p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <div className="flex justify-center gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-6 h-6 text-yellow-300 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-2xl md:text-4xl font-medium text-white mb-8 leading-tight">
                                "I used to worry about my dog while at work. Now I get cute photos and map updates. It's a game changer!"
                            </blockquote>
                            <div className="text-white/90">
                                <div className="font-bold text-lg">Sarah & Barnaby</div>
                                <div className="text-sm">San Francisco, CA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                                    <Dog className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">PetConnect</span>
                            </div>
                            <p className="text-gray-400 max-w-xs">
                                Making pet care easy, reliable, and fun for everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Safety</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                        © 2024 PetConnect. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
