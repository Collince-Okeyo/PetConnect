import WalkerLayout from '../layouts/WalkerLayout'
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

export default function MyWalks() {
  const [walks, setWalks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0
  })
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled'>('all')
  const itemsPerPage = 10

  useEffect(() => {
    fetchWalks()
  }, [currentPage, searchQuery, statusFilter])

  const fetchWalks = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter === 'all' ? undefined : statusFilter
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }

      const response = await api.get('/walks/walker/my-walks', { params })
      
      if (response.data.success) {
        setWalks(response.data.data.walks || [])
        setStats({
          total: response.data.data.stats?.total || 0,
          completed: response.data.data.stats?.completed || 0,
          cancelled: response.data.data.stats?.cancelled || 0,
          totalEarnings: response.data.data.stats?.totalEarnings || 0
        })
        setTotalPages(response.data.data.pagination?.totalPages || 1)
      }
    } catch (err: any) {
      console.error('Error fetching walks:', err)
      setError(err.response?.data?.message || 'Failed to load walks')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchWalks()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diff = end.getTime() - start.getTime()
    const minutes = Math.floor(diff / 60000)
    return `${minutes} mins`
  }

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Walks</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">View all your completed and cancelled walks</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Walks</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Cancelled</p>
                <p className="text-xl md:text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Earned</p>
                <p className="text-xl md:text-2xl font-bold text-teal-600 mt-1">KES {stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-teal-600">KES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by pet name, owner, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'completed' | 'cancelled')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Walks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Walk History</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-2 text-gray-600">Loading walks...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : walks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No walks found</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {walks.map((walk) => (
                  <WalkItem 
                    key={walk._id} 
                    walk={{
                      id: walk._id,
                      petName: walk.pet?.name || 'Unknown Pet',
                      petType: walk.pet?.petType?.name || 'Unknown',
                      ownerName: walk.owner?.name || 'Unknown Owner',
                      date: formatDate(walk.scheduledStartTime),
                      time: formatTime(walk.scheduledStartTime),
                      duration: walk.actualEndTime ? calculateDuration(walk.actualStartTime, walk.actualEndTime) : walk.duration + ' mins',
                      location: walk.pickupLocation || 'N/A',
                      status: walk.status,
                      earnings: `KES ${walk.price?.toLocaleString() || 0}`
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 md:p-6 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </WalkerLayout>
  )
}

interface WalkItemProps {
  walk: {
    id: string
    petName: string
    petType: string
    ownerName: string
    date: string
    time: string
    duration: string
    location: string
    status: string
    earnings: string
  }
}

function WalkItem({ walk }: WalkItemProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-600',
    cancelled: 'bg-red-100 text-red-600'
  }

  return (
    <div className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{walk.petName}'s Walk</h3>
              <p className="text-sm text-gray-600">{walk.petType} • with {walk.ownerName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{walk.date} at {walk.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{walk.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{walk.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-teal-600">{walk.earnings}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[walk.status as keyof typeof statusColors]}`}>
            {walk.status.charAt(0).toUpperCase() + walk.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
