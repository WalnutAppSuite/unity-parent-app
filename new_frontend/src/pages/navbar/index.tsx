import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onClose: () => void;
  setHeaderTitle: (title: string) => void;
}

interface MenuItem {
  title: string;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "login", path: "/login" },
  { title: "home", path: "/" },
  { title: "messages", path: "/notices" },
  { title: "starredMessages", path: "/starred" },
  { title: "archivedMessages", path: "/archived" },
  { title: "curriculumUpdates", path: "/cmap" },
  { title: "absentNote", path: "/absent-note" },
  { title: "earlyPickup", path: "/pickup" },
  { title: "events", path: "/events" },
  { title: "ptmLinks", path: "/ptm" },
  { title: "studentProfile", path: "/profile" },
  { title: "fee", path: "/fee" },
  {
    title: "resultObservation",
    children: [
      { title: "resultObservationSub.result", path: "/result" },
      { title: "resultObservationSub.observation", path: "/observation" },
    ],
  },
  { title: "timetable", path: "/timetable" },
  { title: "knowledgeBase", path: "/knowledge-base" },
  { title: "schoolCalendar", path: "/calendar" },
  { title: "bonafideCertificate", path: "/certificate" },
  { title: "helpdesk", path: "/helpdesk" },
];

const Navbar = ({ onClose, setHeaderTitle }: NavbarProps) => {
  const { t } = useTranslation("navbar");
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleMenuItemClick = (title: string) => {
    setHeaderTitle(t(title));
    onClose();
  };

  const handleWindowReload = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleToggleSubMenu = (title: string) => {
    setOpenMenus((prev: { [key: string]: boolean }) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      return (
        <React.Fragment key={item.title}>
          <li className="tw-border-b tw-border-white/10 tw-bg-custom">
            <button
              className="tw-flex tw-w-full tw-items-center tw-justify-between tw-py-3"
              onClick={() => handleToggleSubMenu(item.title)}
            >
              <span className="tw-text-[15px]">{t(item.title)}</span>
              <ChevronRight
                size={18}
                className={`tw-text-[#7E848D] tw-transition-transform ${openMenus[item.title] ? 'tw-rotate-90' : ''}`}
              />
            </button>
          </li>
          <AnimatePresence initial={false}>
            {openMenus[item.title] && (
              <motion.ul
                className="tw-ml-6 tw-space-y-2"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {item.children.map((child: MenuItem) => (
                  child.path ? (
                    <li key={child.path} className="tw-border-b tw-border-white/10">
                      <Link
                        to={child.path}
                        className="tw-flex tw-items-center tw-justify-between tw-py-2"
                        onClick={() => handleMenuItemClick(child.title)}
                      >
                        <span className="tw-text-[14px]">{t(child.title)}</span>
                        <ChevronRight size={16} className="tw-text-[#7E848D]" />
                      </Link>
                    </li>
                  ) : null
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </React.Fragment>
      );
    } else if (item.path) {
      return (
        <li
          key={item.path}
          onClick={() => handleMenuItemClick(item.title)}
          className="tw-border-b tw-border-white/10 tw-bg-custom"
        >
          <Link
            to={item.path}
            className="tw-flex tw-items-center tw-justify-between tw-py-3"
          >
            <span className="tw-text-[15px]">{t(item.title)}</span>
            <ChevronRight size={18} className="tw-text-[#7E848D]" />
          </Link>
        </li>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="tw-w-full tw-h-screen tw-bg-[#07183C] tw-text-white tw-flex tw-flex-col">
      <div className="tw-p-6">
        <div className="tw-flex tw-items-center tw-justify-center tw-relative">
          <button
            onClick={onClose}
            className="tw-p-2 tw-rounded-full tw-bg-white/10 tw-absolute tw-left-0"
          >
            <ChevronLeft size={30} className="tw-text-[#7E848D]" />
          </button>
          <span className="tw-text-xl">{t("menu")}</span>
        </div>
      </div>

      <nav className="tw-flex-1 tw-overflow-y-auto tw-px-6 tw-py-4">
        <ul className="tw-space-y-4">
          {menuItems.map(renderMenuItem)}
          <li className="tw-border-b tw-border-white/10">
            <button
              onClick={handleWindowReload}
              className="tw-flex tw-w-full tw-items-center tw-justify-between tw-py-3"
            >
              <span className="tw-text-[15px]">{t("reload")}</span>
              <ChevronRight size={18} className="tw-text-[#7E848D]" />
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="tw-flex tw-w-full tw-items-center tw-justify-between tw-py-3"
            >
              <span className="tw-text-[15px]">{t("logout")}</span>
              <ChevronRight size={18} className="tw-text-[#7E848D]" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
