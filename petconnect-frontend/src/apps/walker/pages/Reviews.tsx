import WalkerLayout from '../layouts/WalkerLayout'
import { Star } from 'lucide-react'
import { useState } from 'react'

export default function Reviews() {
  const [filter, setFilter] = useState('all')

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-1">Reviews from pet owners</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Reviews" value="127" />
          <StatCard title="Average Rating" value="4.9" />
          <StatCard title="5 Star Reviews" value="112" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-2">
            {['all', '5', '4', '3', '2', '1'].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilter(rating)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === rating ? 'bg-teal-600 text-white' : 'bg-gray-100'
                }`}
              >
                {rating === 'all' ? 'All' : `${rating}★`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <ReviewCard
            ownerName="John Doe"
            petName="Max"
            rating={5}
            comment="Sarah is an excellent walker! Max always comes back happy and tired. She's very professional and sends regular updates. Highly recommend!"
            date="Dec 19, 2024"
            walkId="#W1234"
          />
          <ReviewCard
            ownerName="Emma Wilson"
            petName="Bella"
            rating={5}
            comment="Great walker! Very punctual and caring. Bella loves her walks with Sarah."
            date="Dec 17, 2024"
            walkId="#W1233"
          />
          <ReviewCard
            ownerName="Mike Davis"
            petName="Charlie"
            rating={4}
            comment="Good service. Charlie enjoyed the walk. Would book again."
            date="Dec 15, 2024"
            walkId="#W1232"
          />
          <ReviewCard
            ownerName="Lisa Anderson"
            petName="Luna"
            rating={5}
            comment="Amazing walker! Luna had a fantastic time. Sarah is very knowledgeable about dogs."
            date="Dec 12, 2024"
            walkId="#W1231"
          />
        </div>
      </div>
    </WalkerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface ReviewCardProps {
  ownerName: string
  petName: string
  rating: number
  comment: string
  date: string
  walkId: string
}

function ReviewCard({ ownerName, petName, rating, comment, date, walkId }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
            {ownerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{ownerName}</h4>
            <p className="text-sm text-gray-500">Walk with {petName} • {walkId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>
      <p className="text-gray-700">{comment}</p>
    </div>
  )
}
