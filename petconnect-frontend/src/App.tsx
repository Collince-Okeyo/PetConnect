import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/auth/VerifyOTP'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import ProtectedRoute from './components/routes/ProtectedRoute'
import Landing from './pages/Landing'

// Admin App
import AdminDashboard from './apps/admin/pages/Dashboard'
import AdminUsers from './apps/admin/pages/Users'
import AdminPets from './apps/admin/pages/Pets'
import AdminWalks from './apps/admin/pages/Walks'
import AdminPayments from './apps/admin/pages/Payments'
import AdminRatings from './apps/admin/pages/Ratings'
import AdminComplaints from './apps/admin/pages/Complaints'
import AdminAnalytics from './apps/admin/pages/Analytics'
import AdminSettings from './apps/admin/pages/Settings'
import AdminProfile from './apps/admin/pages/Profile'

// Owner App
import OwnerDashboard from './apps/owner/pages/Dashboard'
import OwnerPets from './apps/owner/pages/Pets'
import OwnerBookWalk from './apps/owner/pages/BookWalk'
import OwnerMyBookings from './apps/owner/pages/MyBookings'
import OwnerActiveWalks from './apps/owner/pages/ActiveWalks'
import OwnerFindWalkers from './apps/owner/pages/FindWalkers'
import OwnerWallet from './apps/owner/pages/Wallet'
import OwnerReviews from './apps/owner/pages/Reviews'
import OwnerMessages from './apps/owner/pages/Messages'
import OwnerSettings from './apps/owner/pages/Settings'
import OwnerProfile from './apps/owner/pages/Profile'

// Walker App
import WalkerDashboard from './apps/walker/pages/Dashboard'
import WalkerRequests from './apps/walker/pages/Requests'
import WalkerMyWalks from './apps/walker/pages/MyWalks'
import WalkerActiveWalks from './apps/walker/pages/ActiveWalks'
import WalkerSchedule from './apps/walker/pages/Schedule'
import WalkerEarnings from './apps/walker/pages/Earnings'
import WalkerSettings from './apps/walker/pages/Settings'
import WalkerReviews from './apps/walker/pages/Reviews'
import WalkerMessages from './apps/walker/pages/Messages'
import WalkerProfile from './apps/walker/pages/Profile'

import IdleTimer from './components/IdleTimer'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()
  
  // Idle timeout configuration
  const IDLE_TIMEOUT = Number(import.meta.env.VITE_IDLE_TIMEOUT) || 30 * 60 * 1000 // 30 minutes
  const WARNING_TIME = Number(import.meta.env.VITE_WARNING_TIME) || 2 * 60 * 1000 // 2 minutes

  return (
    <BrowserRouter>
      {/* Idle Timer - only active when user is logged in */}
      {user && (
        <IdleTimer 
          timeout={IDLE_TIMEOUT}
          warningTime={WARNING_TIME}
        />
      )}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/pets" element={<AdminPets />} />
          <Route path="/admin/walks" element={<AdminWalks />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/ratings" element={<AdminRatings />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute roles={['owner']} />}>
          <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/pets" element={<OwnerPets />} />
          <Route path="/owner/book-walk" element={<OwnerBookWalk />} />
          <Route path="/owner/my-bookings" element={<OwnerMyBookings />} />
          <Route path="/owner/active-walks" element={<OwnerActiveWalks />} />
          <Route path="/owner/walkers" element={<OwnerFindWalkers />} />
          <Route path="/owner/wallet" element={<OwnerWallet />} />
          <Route path="/owner/reviews" element={<OwnerReviews />} />
          <Route path="/owner/messages" element={<OwnerMessages />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
        </Route>

        {/* Walker Routes */}
        <Route element={<ProtectedRoute roles={['walker']} />}>
          <Route path="/walker" element={<Navigate to="/walker/dashboard" replace />} />
          <Route path="/walker/dashboard" element={<WalkerDashboard />} />
          <Route path="/walker/requests" element={<WalkerRequests />} />
          <Route path="/walker/my-walks" element={<WalkerMyWalks />} />
          <Route path="/walker/active-walks" element={<WalkerActiveWalks />} />
          <Route path="/walker/schedule" element={<WalkerSchedule />} />
          <Route path="/walker/earnings" element={<WalkerEarnings />} />
          <Route path="/walker/reviews" element={<WalkerReviews />} />
          <Route path="/walker/messages" element={<WalkerMessages />} />
          <Route path="/walker/profile" element={<WalkerProfile />} />
          <Route path="/walker/settings" element={<WalkerSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
