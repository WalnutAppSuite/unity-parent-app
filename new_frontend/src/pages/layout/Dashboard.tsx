import Header from '@/pages/header';
import Navbar from '@/pages/navbar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
        className="tw-w-full"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
