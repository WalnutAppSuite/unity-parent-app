import Header from '@/pages/header';
import Navbar from '@/pages/navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { basePath } from '@/constants';

const navbarVariants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('Notices');
  const { t } = useTranslation('dashboard');
  const [isDarkHeader, setIsDarkHeader] = useState(false);
  const location = useLocation();

  // Map each path to a translation key
  const pathTitleMap: Record<string, string> = {
    '/notices': 'notices',
    '/notices/:noticeId': 'noticeDetails',
    '/cmap': 'curriculumUpdates',
    '/daily/list': 'dailyListing',
    '/weekly/list': 'weeklyListing',
    '/portion/list': 'portionListing',
    '/absent-note': 'absentNote',
    '/pickup': 'earlyPickup',
    '/events': 'events',
    '/ptm': 'ptmLinks',
    '/ptm/online': 'ptmOnline',
    '/ptm/offline': 'ptmOffline',
    '/profile': 'studentProfile',
    '/fee': 'fee',
    '/fee/list': 'feeListing',
    '/result': 'result',
    '/calendar': 'schoolCalendar',
    '/school-calendar': 'schoolCalendar',
    '/certificate': 'bonafideCertificate',
    '/helpdesk': 'helpdesk',
    '/observation': 'observation',
    '/observation/list': 'observation',
    '/timetable': 'timetable',
    '/timetable/detailed': 'timetableDetailed',
    '/starred': 'starredMessages',
    '/archived': 'archivedMessages',
    '/knowledge-base' : 'knowledgeBase',
    '/knowledge-base/detailed' : 'knowledgeBase',
    '*': 'notFound'
  };

  useEffect(() => {
    let path = location.pathname;
    if (path.startsWith(basePath)) {
      path = path.slice(basePath.length) || '/';
    }

    let titleKey = pathTitleMap[path];

    // Detect dynamic notice details route
    const isNoticeDetails = /^\/notices\/[^/]+$/.test(path);

    if (isNoticeDetails) {
      titleKey = 'noticeDetails';
      setIsDarkHeader(true);
    }

    if (titleKey === 'notices' || titleKey === 'schoolCalendar' || titleKey === 'noticeDetails' || titleKey === 'starredMessages' || titleKey === 'archivedMessages') {
      setIsDarkHeader(false);
    } else {
      setIsDarkHeader(true);
    }

    setHeaderTitle(t(titleKey || ''));
  }, [location.pathname, t]);

  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="tw-w-full tw-h-screen tw-flex tw-flex-col tw-bg-background-accent">
      <Header onMenuClick={toggleSidebar} headerTitle={headerTitle} className="tw-h-14" isDarkHeader={!isDarkHeader} />
      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="tw-fixed tw-inset-0 tw-bg-black/50 tw-z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={navbarVariants}
            className="tw-fixed tw-inset-0 tw-z-50"
          >
            <Navbar onClose={toggleSidebar} setHeaderTitle={setHeaderTitle} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="tw-w-full tw-bg-background-accent tw-min-h-[calc(100vh-56px)] tw-overflow-y-scroll tw-flex tw-justify-center">
        <motion.div
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 1000 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="tw-bg-background-accent tw-relative tw-max-w-md tw-w-full tw-h-full tw-border-opacity-30 tw-overflow-y-auto tw-shadow-primary tw-shadow-2xl"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
