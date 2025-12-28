import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'

interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  speed?: number
}

interface UseLocationTrackingProps {
  walkId: string
  isTracking: boolean
  updateInterval?: number // milliseconds
}

export function useLocationTracking({ walkId, isTracking, updateInterval = 10000 }: UseLocationTrackingProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Request location permission
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionGranted(result.state === 'granted')
        
        result.addEventListener('change', () => {
          setPermissionGranted(result.state === 'granted')
        })
      })
    } else {
      setError('Geolocation is not supported by your browser')
    }
  }, [])

  // Update location to server
  const updateLocationToServer = async (locationData: LocationData) => {
    try {
      await api.put(`/walks/${walkId}/location`, locationData)
    } catch (err: any) {
      console.error('Error updating location:', err)
      setError(err.response?.data?.message || 'Failed to update location')
    }
  }

  // Get current position
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0
        }
        
        setLocation(locationData)
        setError(null)
        
        // Send to server
        updateLocationToServer(locationData)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }

  // Start/stop tracking
  useEffect(() => {
    if (isTracking && permissionGranted) {
      // Get initial position
      getCurrentPosition()
      
      // Set up interval for continuous tracking
      intervalRef.current = setInterval(() => {
        getCurrentPosition()
      }, updateInterval)
    } else {
      // Clear interval when tracking stops
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTracking, permissionGranted, walkId, updateInterval])

  return {
    location,
    error,
    permissionGranted,
    getCurrentPosition
  }
}
