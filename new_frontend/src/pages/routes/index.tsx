import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import Login from '@/pages/login';
import NoticeListingPage from '@/pages/notices/home';
import DashboardLayout from '@/pages/layout/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />

      {/* Protected/dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/notices" element={<NoticeListingPage />} />
        {/* Add more dashboard routes here */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;