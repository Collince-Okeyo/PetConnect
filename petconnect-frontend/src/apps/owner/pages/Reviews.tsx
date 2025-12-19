import OwnerLayout from '../layouts/OwnerLayout'
import { Star } from 'lucide-react'
import { useState } from 'react'

export default function Reviews() {
  const [filter, setFilter] = useState('all')

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-1">Reviews you've given to walkers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Reviews" value="23" />
          <StatCard title="Average Rating" value="4.8" />
          <StatCard title="Pending Reviews" value="2" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-2">
            {['all', '5', '4', '3', '2', '1'].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilter(rating)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === rating ? 'bg-purple-600 text-white' : 'bg-gray-100'
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
            walkerName="Sarah Johnson"
            petName="Max"
            rating={5}
            comment="Excellent service! Sarah was very professional and my dog loved the walk. She sent regular updates and photos. Highly recommend!"
            date="Dec 19, 2024"
            walkId="#W1234"
          />
          <ReviewCard
            walkerName="Mike Davis"
            petName="Bella"
            rating={4}
            comment="Good walker, very punctual. My pet enjoyed the walk and came back happy and tired."
            date="Dec 17, 2024"
            walkId="#W1233"
          />
          <ReviewCard
            walkerName="Emma Wilson"
            petName="Charlie"
            rating={5}
            comment="Amazing! Emma is fantastic with dogs. Charlie had a great time and she even helped with some basic training tips."
            date="Dec 15, 2024"
            walkId="#W1232"
          />
          <ReviewCard
            walkerName="James Brown"
            petName="Max"
            rating={4}
            comment="Reliable and friendly. James took good care of Max and followed all my instructions."
            date="Dec 12, 2024"
            walkId="#W1231"
          />
        </div>

        {/* Pending Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Reviews</h2>
          <div className="space-y-4">
            <PendingReviewCard
              walkerName="Lisa Anderson"
              petName="Bella"
              date="Dec 20, 2024"
              walkId="#W1235"
            />
            <PendingReviewCard
              walkerName="Tom Wilson"
              petName="Charlie"
              date="Dec 20, 2024"
              walkId="#W1236"
            />
          </div>
        </div>
      </div>
    </OwnerLayout>
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
  walkerName: string
  petName: string
  rating: number
  comment: string
  date: string
  walkId: string
}

function ReviewCard({ walkerName, petName, rating, comment, date, walkId }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {walkerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{walkerName}</h4>
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

interface PendingReviewCardProps {
  walkerName: string
  petName: string
  date: string
  walkId: string
}

function PendingReviewCard({ walkerName, petName, date, walkId }: PendingReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {walkerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{walkerName}</h4>
            <p className="text-sm text-gray-500">Walk with {petName} • {walkId}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
          Write Review
        </button>
      </div>
    </div>
  )
}
