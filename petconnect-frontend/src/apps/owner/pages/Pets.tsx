import OwnerLayout from '../layouts/OwnerLayout'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { useState } from 'react'
import AddPetModal from '../../../components/AddPetModal'

export default function Pets() {
  const [showAddPetModal, setShowAddPetModal] = useState(false)

  const handlePetAdded = () => {
    // Refresh the page to show the new pet
    window.location.reload()
  }

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
            <p className="text-gray-600 mt-1">Manage your furry friends</p>
          </div>
          <button
            onClick={() => setShowAddPetModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Pet
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Pets" value="3" />
          <StatCard title="Total Walks" value="105" />
          <StatCard title="Active Today" value="2" />
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PetCard
            name="Max"
            breed="Golden Retriever"
            age="3 years"
            weight="30 kg"
            image="🐕"
            walks="45"
            lastWalk="Yesterday"
            vaccinated={true}
          />
          <PetCard
            name="Bella"
            breed="Labrador"
            age="2 years"
            weight="25 kg"
            image="🦮"
            walks="32"
            lastWalk="2 days ago"
            vaccinated={true}
          />
          <PetCard
            name="Charlie"
            breed="Beagle"
            age="4 years"
            weight="15 kg"
            image="🐶"
            walks="28"
            lastWalk="Today"
            vaccinated={true}
          />
        </div>
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onSuccess={handlePetAdded}
      />
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

interface PetCardProps {
  name: string
  breed: string
  age: string
  weight: string
  image: string
  walks: string
  lastWalk: string
  vaccinated: boolean
}

function PetCard({ name, breed, age, weight, image, walks, lastWalk, vaccinated }: PetCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-5xl">
          {image}
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-3">{breed}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Age</span>
          <span className="font-medium text-gray-900">{age}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Weight</span>
          <span className="font-medium text-gray-900">{weight}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Vaccinated</span>
          <span className={`font-medium ${vaccinated ? 'text-green-600' : 'text-red-600'}`}>
            {vaccinated ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Total Walks</span>
          <span className="text-lg font-bold text-purple-600">{walks}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Last Walk</span>
          <span className="text-sm font-medium text-gray-900">{lastWalk}</span>
        </div>
        <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Book Walk
        </button>
      </div>
    </div>
  )
}
