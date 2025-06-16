import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import Login from '@/pages/login';
import NoticeListingPage from '@/pages/notices/home';
import DetailedNotices from '@/pages/notices/detailed';
import DashboardLayout from '@/pages/layout/Dashboard';
import Absent from '@/pages/absent';
import EarlyPickup from '@/pages/early pickup';
import Event from '@/pages/events';
import PTM from '@/pages/ptm';
import StudentProfile from '@/pages/student profile';
import Fee from '@/pages/fee';
import Result from '@/pages/result';
import Observation from '@/pages/observation';
import SchoolCalendar from '@/pages/school calendar';
import Certificate from '@/pages/bonafide certificate';
import HelpDesk from '@/pages/helpdesk';
import Daily from '@/pages/daily/index';
import Portion from '@/pages/portion/index';
import Weekly from '@/pages/weekly/index';
import DailyListing from '@/pages/daily/listing';
import WeeklyListing from '@/pages/weekly/listing'; 
import PortionListing from '@/pages/portion/listing';
import Timetable from '@/pages/timetable/index';
import KnowledgeBase from '@/pages/knowledge base/index';
import StarredMessages from '@/pages/starred/index';
import ArchivedMessages from '@/pages/archived/index';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />

      {/* Protected/dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/notices" element={<NoticeListingPage />} />
        <Route path="/notices/:noticeId" element={<DetailedNotices />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/daily/list" element={<DailyListing />} />
        <Route path="/portion" element={<Portion />} />
        <Route path="/portion/list" element={<PortionListing />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/weekly/list" element={<WeeklyListing />} />
        <Route path="/absent-note" element={<Absent />} />
        <Route path="/pickup" element={<EarlyPickup />} />
        <Route path="/events" element={<Event />} />
        <Route path="/ptm" element={<PTM />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/result" element={<Result />} />
        <Route path="/observation" element={<Observation />} />
        <Route path="/calendar" element={<SchoolCalendar />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/helpdesk" element={<HelpDesk />} /> 
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path='/starred' element={<StarredMessages />} />
        <Route path='/archived' element={<ArchivedMessages />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;