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

// Owner App
import OwnerDashboard from './apps/owner/pages/Dashboard'

// Walker App
import WalkerDashboard from './apps/walker/pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
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
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute roles={['owner']} />}>
          <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>

        {/* Walker Routes */}
        <Route element={<ProtectedRoute roles={['walker']} />}>
          <Route path="/walker" element={<Navigate to="/walker/dashboard" replace />} />
          <Route path="/walker/dashboard" element={<WalkerDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
