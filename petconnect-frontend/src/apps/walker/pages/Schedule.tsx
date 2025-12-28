import WalkerLayout from '../layouts/WalkerLayout'
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

interface Walk {
  _id: string
  pet: {
    _id: string
    name: string
  }
  owner: {
    _id: string
    name: string
  }
  scheduledDate: string
  scheduledTime: string
  duration: number
  price: number
  status: string
  pickupLocation?: string
}

export default function Schedule() {
  const [walks, setWalks] = useState<Walk[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    fetchWalks()
  }, [])

  const fetchWalks = async () => {
    try {
      setLoading(true)
      const response = await api.get('/walks/my-walks') // Fetch all walks
      
      if (response.data.success) {
        setWalks(response.data.data.walks)
      }
    } catch (err: any) {
      console.error('Error fetching walks:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const getWalksForDate = (date: Date) => {
    return walks.filter(walk => {
      const walkDate = new Date(walk.scheduledDate)
      return walkDate.toDateString() === date.toDateString()
    })
  }

  const getTodaysWalks = () => {
    const today = new Date()
    return walks.filter(walk => {
      const walkDate = new Date(walk.scheduledDate)
      return walkDate.toDateString() === today.toDateString()
    }).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
  }

  const getUpcomingWalks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return walks.filter(walk => {
      const walkDate = new Date(walk.scheduledDate)
      walkDate.setHours(0, 0, 0, 0)
      return walkDate > today
    }).sort((a, b) => {
      const dateCompare = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      if (dateCompare !== 0) return dateCompare
      return a.scheduledTime.localeCompare(b.scheduledTime)
    }).slice(0, 5) // Show next 5 upcoming walks
  }

  const getPastWalks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return walks.filter(walk => {
      const walkDate = new Date(walk.scheduledDate)
      walkDate.setHours(0, 0, 0, 0)
      return walkDate < today && (walk.status === 'completed' || walk.status === 'cancelled')
    }).sort((a, b) => {
      const dateCompare = new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime() // Most recent first
      if (dateCompare !== 0) return dateCompare
      return b.scheduledTime.localeCompare(a.scheduledTime)
    }).slice(0, 5) // Show last 5 past walks
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="py-3"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      date.setHours(0, 0, 0, 0)
      const walksOnDay = getWalksForDate(date)
      const isToday = date.getTime() === today.getTime()
      const hasWalks = walksOnDay.length > 0
      const isPast = date < today
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

      days.push(
        <div
          key={day}
          className={`text-center py-3 rounded-lg cursor-pointer transition-all relative ${
            isToday
              ? 'bg-teal-600 text-white font-bold'
              : hasWalks && !isPast
              ? 'bg-teal-100 text-teal-600 font-medium'
              : hasWalks && isPast
              ? 'bg-gray-200 text-gray-600 font-medium'
              : isPast
              ? 'text-gray-400'
              : 'hover:bg-gray-100'
          } ${isSelected ? 'ring-2 ring-teal-500 ring-offset-1' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
          {hasWalks && !isToday && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {walksOnDay.slice(0, 3).map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${isPast ? 'bg-gray-600' : 'bg-teal-600'}`}></div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  if (loading) {
    return (
      <WalkerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600">Loading schedule...</span>
        </div>
      </WalkerLayout>
    )
  }

  const todaysWalks = getTodaysWalks()
  const upcomingWalks = getUpcomingWalks()
  const pastWalks = getPastWalks()

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">View your upcoming walks</p>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{formatMonthYear(currentMonth)}</h2>
            <div className="flex gap-2">
              <button 
                onClick={previousMonth}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button 
                onClick={nextMonth}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Selected Date Details */}
          {selectedDate && getWalksForDate(selectedDate).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Walks on {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <div className="space-y-3">
                {getWalksForDate(selectedDate).map((walk) => (
                  <ScheduleItem
                    key={walk._id}
                    walk={walk}
                    formatTime={formatTime}
                    formatDate={formatDate}
                    isPast={new Date(walk.scheduledDate) < new Date()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        {todaysWalks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {todaysWalks.map((walk) => (
                <ScheduleItem
                  key={walk._id}
                  walk={walk}
                  formatTime={formatTime}
                  formatDate={formatDate}
                  isPast={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Schedule */}
        {upcomingWalks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming This Week</h2>
            <div className="space-y-4">
              {upcomingWalks.map((walk) => (
                <ScheduleItem
                  key={walk._id}
                  walk={walk}
                  formatTime={formatTime}
                  formatDate={formatDate}
                  isPast={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Walks */}
        {pastWalks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Walks</h2>
            <div className="space-y-4">
              {pastWalks.map((walk) => (
                <ScheduleItem
                  key={walk._id}
                  walk={walk}
                  formatTime={formatTime}
                  formatDate={formatDate}
                  isPast={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Walks */}
        {todaysWalks.length === 0 && upcomingWalks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Scheduled Walks</h3>
            <p className="text-gray-600">You don't have any confirmed walks scheduled</p>
          </div>
        )}
      </div>
    </WalkerLayout>
  )
}

interface ScheduleItemProps {
  walk: Walk
  formatTime: (time: string) => string
  formatDate: (date: string) => string
  isPast: boolean
}

function ScheduleItem({ walk, formatTime, formatDate, isPast }: ScheduleItemProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isPast ? 'border-gray-300 opacity-75' : 'border-gray-200'} p-4 hover:shadow-md transition-all`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 ${isPast ? 'bg-gray-100' : 'bg-teal-100'} rounded-lg flex flex-col items-center justify-center`}>
            <Clock className={`w-5 h-5 ${isPast ? 'text-gray-500' : 'text-teal-600'} mb-1`} />
            <span className={`text-xs font-medium ${isPast ? 'text-gray-500' : 'text-teal-600'}`}>{formatTime(walk.scheduledTime)}</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${isPast ? 'text-gray-600' : 'text-gray-900'}`}>{walk.pet.name}'s Walk</h4>
          <p className={`text-sm ${isPast ? 'text-gray-500' : 'text-gray-600'}`}>with {walk.owner.name}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(walk.scheduledDate)}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {walk.duration} mins
            </span>
            {walk.pickupLocation && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {walk.pickupLocation}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`text-sm font-semibold ${isPast ? 'text-gray-500' : 'text-teal-600'}`}>KES {walk.price.toFixed(0)}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isPast 
                ? walk.status === 'completed' 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-red-100 text-red-600'
                : walk.status === 'confirmed' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {walk.status}
            </span>
          </div>
          <ChevronRight className={`w-5 h-5 ${isPast ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
      </div>
    </div>
  )
}
