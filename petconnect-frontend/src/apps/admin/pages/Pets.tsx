import AdminLayout from '../layouts/AdminLayout'
import { Search, Dog, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function Pets() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pet Management</h1>
          <p className="text-gray-600 mt-1">View and manage all registered pets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Pets" value="1,542" color="purple" />
          <StatCard title="Dogs" value="1,234" color="blue" />
          <StatCard title="Cats" value="308" color="pink" />
          <StatCard title="Active Today" value="456" color="green" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pet name, breed, or owner..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('dogs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'dogs' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Dogs
              </button>
              <button
                onClick={() => setFilter('cats')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'cats' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cats
              </button>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PetCard
            name="Max"
            breed="Golden Retriever"
            age="3 years"
            owner="John Doe"
            image="🐕"
            walks="45"
          />
          <PetCard
            name="Bella"
            breed="Labrador"
            age="2 years"
            owner="Emma Wilson"
            image="🦮"
            walks="32"
          />
          <PetCard
            name="Charlie"
            breed="Beagle"
            age="4 years"
            owner="James Brown"
            image="🐶"
            walks="28"
          />
          <PetCard
            name="Luna"
            breed="Husky"
            age="1 year"
            owner="Sarah Johnson"
            image="🐕‍🦺"
            walks="15"
          />
          <PetCard
            name="Cooper"
            breed="Poodle"
            age="5 years"
            owner="Mike Davis"
            image="🐩"
            walks="52"
          />
          <PetCard
            name="Daisy"
            breed="Bulldog"
            age="3 years"
            owner="Lisa Anderson"
            image="🐕"
            walks="38"
          />
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1-6</span> of <span className="font-medium">1,542</span>
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  color: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface PetCardProps {
  name: string
  breed: string
  age: string
  owner: string
  image: string
  walks: string
}

function PetCard({ name, breed, age, owner, image, walks }: PetCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-4xl">
          {image}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-1">{breed}</p>
      <p className="text-xs text-gray-500 mb-3">{age}</p>
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Owner</p>
        <p className="text-sm font-medium text-gray-900 mb-2">{owner}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Total Walks</span>
          <span className="text-sm font-semibold text-indigo-600">{walks}</span>
        </div>
      </div>
    </div>
  )
}
