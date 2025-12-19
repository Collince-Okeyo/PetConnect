import AdminLayout from '../layouts/AdminLayout'
import { Search, Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'

export default function Ratings() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600 mt-1">Monitor walker and owner reviews</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Average Rating" value="4.7" icon={<Star className="w-5 h-5" />} />
          <StatCard title="Total Reviews" value="2,345" icon={<Star className="w-5 h-5" />} />
          <StatCard title="5 Star" value="1,876" icon={<ThumbsUp className="w-5 h-5" />} />
          <StatCard title="1-2 Star" value="89" icon={<ThumbsDown className="w-5 h-5" />} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', '5', '4', '3', '2', '1'].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilter(rating)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === rating ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  {rating === 'all' ? 'All' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <ReviewCard
            reviewerName="John Doe"
            reviewerRole="Pet Owner"
            targetName="Sarah Johnson"
            targetRole="Walker"
            rating={5}
            comment="Excellent service! Sarah was very professional and my dog loved the walk."
            date="Dec 19, 2024"
            walkId="#W1234"
          />
          <ReviewCard
            reviewerName="Emma Wilson"
            reviewerRole="Pet Owner"
            targetName="Mike Davis"
            targetRole="Walker"
            rating={4}
            comment="Good walker, very punctual. My pet enjoyed the walk."
            date="Dec 18, 2024"
            walkId="#W1233"
          />
          <ReviewCard
            reviewerName="Sarah Johnson"
            reviewerRole="Walker"
            targetName="James Brown"
            targetRole="Pet Owner"
            rating={5}
            comment="Great pet owner, very communicative and pet was well-behaved."
            date="Dec 17, 2024"
            walkId="#W1232"
          />
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between">
          <p className="text-sm text-gray-600">Showing 1-10 of 2,345</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg">Previous</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
          {icon}
        </div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface ReviewCardProps {
  reviewerName: string
  reviewerRole: string
  targetName: string
  targetRole: string
  rating: number
  comment: string
  date: string
  walkId: string
}

function ReviewCard({ reviewerName, reviewerRole, targetName, targetRole, rating, comment, date, walkId }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {reviewerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{reviewerName}</h4>
            <p className="text-sm text-gray-500">{reviewerRole}</p>
            <p className="text-xs text-gray-400 mt-1">
              Reviewed {targetName} ({targetRole}) • Walk {walkId}
            </p>
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
