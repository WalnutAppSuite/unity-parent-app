import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import Login from '@/pages/login';
import NoticeListingPage from '@/pages/notices/home';
import DetailedNotices from '@/pages/notices/detailed';
import DashboardLayout from '@/pages/layout/Dashboard';
import Absent from '@/pages/absent';
import EarlyPickup from '@/pages/early-pickup';
import Event from '@/pages/events';
import PTM from '@/pages/ptm/index';
import PTMOnline from '@/pages/ptm/online-ptm';
import PTMOffline from '@/pages/ptm/offline-ptm';
import StudentProfile from '@/pages/student-profile';
import Fee from '@/pages/fee';
import FeeListing from "@/pages/fee/listing"
import Result from '@/pages/result';
import Observation from '@/pages/class-participation/index';
import ObservationListing from '@/pages/class-participation/listing'
import SchoolCalendar from '@/pages/school-calendar/index';
import SchoolCalendarEmbed from '@/pages/school-calendar/school_calendar';
import Certificate from '@/pages/bonafide-certificate';
import HelpDesk from '@/pages/helpdesk';
import Cmap from '@/pages/cmap';
import Timetable from '@/pages/timetable/index';
import TimetableDetailed from '@/pages/timetable/detailed';
import KnowledgeBase from '@/pages/knowledge-base/index';
import DetailedKnowledgeBase from '@/pages/knowledge-base/detailed';
import StarredMessages from '@/pages/starred/index';
import ArchivedMessages from '@/pages/archived/index';
import DailyListing from '@/pages/daily/listing';
import WeeklyListing from '@/pages/weekly/listing';
import PortionListing from '@/pages/portion/listing';
import NotFound from '@/pages/404';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Protected/dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/notices" element={<NoticeListingPage />} />
        <Route path="/notices/:noticeId" element={<DetailedNotices />} />
        <Route path="/cmap" element={<Cmap />} />
        <Route path="/daily/list" element={<DailyListing />} />
        <Route path="/weekly/list" element={<WeeklyListing />} />
        <Route path="/portion/list" element={<PortionListing />} />
        <Route path="/absent-note" element={<Absent />} />
        <Route path="/pickup" element={<EarlyPickup />} />
        <Route path="/events" element={<Event />} />
        <Route path="/ptm" element={<PTM />} />
        <Route path="/ptm/online" element={<PTMOnline />} />
        <Route path="/ptm/offline" element={<PTMOffline />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/fee/list" element={<FeeListing />} />
        <Route path="/result" element={<Result />} />
        <Route path="/observation" element={<Observation />} />
        <Route path="/observation/list" element={<ObservationListing />} />
        <Route path="/calendar" element={<SchoolCalendar />} />
        <Route path="/school-calendar" element={<SchoolCalendarEmbed />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/helpdesk" element={<HelpDesk />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/knowledge-base/detailed" element={<DetailedKnowledgeBase />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/timetable/detailed" element={<TimetableDetailed />} />
        <Route path='/starred' element={<StarredMessages />} />
        <Route path='/archived' element={<ArchivedMessages />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;