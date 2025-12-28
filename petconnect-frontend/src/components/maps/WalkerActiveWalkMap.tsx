import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface RoutePoint {
  latitude: number
  longitude: number
  timestamp: string
}

interface WalkerActiveWalkMapProps {
  currentLocation: { latitude: number; longitude: number } | null
  route: RoutePoint[]
  petName: string
}

// Component to recenter map when location changes
function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  
  return null
}

export default function WalkerActiveWalkMap({ currentLocation, route, petName }: WalkerActiveWalkMapProps) {
  // Default center (Nairobi, Kenya)
  const defaultCenter: LatLngExpression = [-1.286389, 36.817223]
  
  const center: LatLngExpression = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude]
    : defaultCenter

  const routePositions: LatLngExpression[] = route.map(point => [point.latitude, point.longitude])

  // Custom walker icon
  const walkerIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Start marker icon
  const startIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {currentLocation && <RecenterMap center={center} />}
        
        {/* Route polyline */}
        {routePositions.length > 0 && (
          <Polyline
            positions={routePositions}
            color="#0ea5e9"
            weight={4}
            opacity={0.7}
          />
        )}
        
        {/* Start marker */}
        {routePositions.length > 0 && (
          <Marker position={routePositions[0]} icon={startIcon}>
            <Popup>Walk Started Here</Popup>
          </Marker>
        )}
        
        {/* Current location marker */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={walkerIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Current Location</p>
                <p className="text-sm text-gray-600">Walking {petName}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
