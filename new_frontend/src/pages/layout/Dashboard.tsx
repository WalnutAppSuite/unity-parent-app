import Header from '@/pages/header';
import Navbar from '@/pages/navbar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  // Map each path to a translation key
  const pathTitleMap: Record<string, string> = {
    '/notices': 'notices',
    '/absent-note': 'absentNote',
    '/pickup': 'earlyPickup',
    '/events': 'events',
    '/ptm': 'ptmLinks',
    '/cmap' : 'Curriculum Updates',
    '/result': 'result',
    '/observation': 'observation',
    '/school-calendar': 'schoolCalendar',
    '/bonafide-certificate': 'bonafideCertificate',
    '/helpdesk': 'helpdesk',
    '/timetable': 'timetable',
    '/profile': 'studentProfile',
    '/fee': 'fee',
    '/knowledge-base': 'knowledgeBase',
    '/starred': 'starredMessages',
    '/archived': 'archivedMessages',
  };

  useEffect(() => {
    let path = window.location.pathname;
    if (path.startsWith(basePath)) {
      path = path.slice(basePath.length) || '/';
    }
    const titleKey = pathTitleMap[path] || '';
    setHeaderTitle(t(titleKey));
  }, [window.location.pathname, t]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="tw-w-full tw-h-screen tw-flex tw-flex-col">
      <Header onMenuClick={toggleSidebar} headerTitle={headerTitle} className="tw-h-14" />
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
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 1000 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="tw-w-full tw-bg-background-asscent"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
