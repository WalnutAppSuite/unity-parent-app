import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Authenticated, useIsAuthenticated } from "@refinedev/core";
import { Login } from "./login.tsx";
import { Header } from "../components";
import { NoticeList } from "./notices";
import { NoticeDetails } from "./notices/details.tsx";
import { ErrorComponent } from "@refinedev/mantine";
import { AppShell } from "@mantine/core";
import Navbar from "../components/organisms/navbar";
import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { usePendingForms } from "../context/PendingFormsContext";
import Cmap from "./cmap";
import CmapList from "./cmap/list.tsx";
// import LeaveNote from "./leave-note.tsx";
import { SchoolCalendar } from "./SchoolCalendar.tsx";
import { BonafideCertificate } from "./BonafideCertificate.tsx";
import PortionCircular from "./portion-circular/index.tsx";
import PortionCircularList from "./portion-circular/list.tsx";
import DateCmap from "./date-circular/index.tsx";
import CmapDateList from "./date-circular/list.tsx";
// import EarlyPickup from "./EarlyPickup.tsx";
import ProfileChange from "./profile change/index.tsx";
import { StudentProfle } from "./StudentProfile.tsx";
import { PtmLinks } from "./PtmLinks.tsx";
import Fees from "./fee/index.tsx";
import { FeesList } from "./fee/List.tsx";
import { Results } from "./Results.tsx";
import { RenderPDF } from "./render-pdf.tsx";
import { Register } from "./register.tsx";
import FrappeFormWrapper from "./forms/FrappeFormWrapper.tsx";
import Attendance from "./Attendance.tsx";
import Wiki from "./wiki/index.tsx";
import Timetable from "./Timetable.tsx";

import ArchivedFiles from "./archived-files/index.tsx";
// import { Results } from "./Result.tsx";
const isPublicAvailable = import.meta.env.VITE_PUBLIC_AVAILABLE === "true";
const Pages = () => {
  // const location = useLocation()
  const isAuthenticated = useIsAuthenticated();
  const [isNavBarOpen, setIsNavBarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsOnFormPage } = usePendingForms();

  useEffect(() => {
    // Check if current path is a form page
    const isFormPage = location.pathname.startsWith("/forms/");
    setIsOnFormPage(isFormPage);
  }, [location.pathname, setIsOnFormPage]);

  useEffect(() => {
    // @ts-expect-error new assignment
    window.updateLocation = navigate;
  }, [navigate]);
  return (
    <AppShell
      sx={{
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        ".mantine-AppShell-body": {
          "max-width": "700px",
          width: "100%",
          "box-shadow": "0 0 10px 10px rgba(0, 0, 0, 0.1)",
          padding: isAuthenticated.data?.authenticated ? "0" : "0",
          ".mantine-AppShell-main": {
            "padding-left": isAuthenticated.data?.authenticated ? "0px" : "0",
            "padding-right": isAuthenticated.data?.authenticated ? "0px" : "0",
            "padding-bottom": isAuthenticated.data?.authenticated ? "5px" : "0",
            "padding-top": isAuthenticated.data?.authenticated ? "60px" : "0",
            position: "relative",

            width: "100%",
          },
        },
      }}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <>
              <Header
                setNavbarOpen={setIsNavBarOpen}
                navbarOpen={isNavBarOpen}
              />
              <Navbar isOpen={isNavBarOpen} setIsOpen={setIsNavBarOpen} />
              <Login />{" "}
            </>
          }
        />
        {isPublicAvailable ? (
          <>
            <Route
              path="/"
              element={
                <>
                  <Header
                    setNavbarOpen={setIsNavBarOpen}
                    navbarOpen={isNavBarOpen}
                  />
                  <Navbar isOpen={isNavBarOpen} setIsOpen={setIsNavBarOpen} />
                  <NoticeList />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Header
                    setNavbarOpen={setIsNavBarOpen}
                    navbarOpen={isNavBarOpen}
                  />
                  <Navbar isOpen={isNavBarOpen} setIsOpen={setIsNavBarOpen} />
                  <Register />
                </>
              }
            />
            <Route
              path="/notice/:id"
              element={
                <>
                  <Header
                    setNavbarOpen={setIsNavBarOpen}
                    navbarOpen={isNavBarOpen}
                  />
                  <Navbar isOpen={isNavBarOpen} setIsOpen={setIsNavBarOpen} />
                  <NoticeDetails />
                </>
              }
            />
          </>
        ) : null}

        <Route
          path="/*"
          element={
            <Authenticated
              key="authenticated-outer"
              fallback={<Navigate to="/login" />}
              v3LegacyAuthProviderCompatible
            >
              <Header
                setNavbarOpen={setIsNavBarOpen}
                navbarOpen={isNavBarOpen}
              />
              <Navbar isOpen={isNavBarOpen} setIsOpen={setIsNavBarOpen} />
              <Routes>
                {!isPublicAvailable ? (
                  <>
                    <Route path="/notice/:id" element={<NoticeDetails />} />
                    <Route path="/" element={<NoticeList />} />
                  </>
                ) : null}
                <Route path="/stared" element={<NoticeList staredOnly />} />
                <Route path="/archived" element={<NoticeList archivedOnly />} />
                <Route path="/calendar" element={<SchoolCalendar />} />
                <Route path="/bonafide" element={<BonafideCertificate />} />
                <Route path="/ptm-link" element={<PtmLinks />} />
                <Route path="/student-profile" element={<StudentProfle />} />
                {/* <Route path="/early-pickup" element={<EarlyPickup />} /> */}
                <Route path="/archived-files" element={<ArchivedFiles />} />

                <Route path="/attendance" element={<Attendance />} />
                <Route path="/archived-files" element={<ArchivedFiles />} />

                <Route path="/cmap" element={<Cmap />} />
                <Route path="/cmap/list" element={<CmapList />} />
                <Route path="/portion-circular" element={<PortionCircular />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/fees/list" element={<FeesList />} />
                <Route path="/report-card" element={<Results />} />
                <Route path="/wiki" element={<Wiki />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route
                  path="/portion-circular/list"
                  element={<PortionCircularList />}
                />

                <Route path="/profile-change" element={<ProfileChange />} />

                <Route path="/date-circular" element={<DateCmap />} />
                <Route path="/date-circular/list" element={<CmapDateList />} />
                <Route
                  path="/forms/:formRoute"
                  element={<FrappeFormWrapper />}
                />
                {/* <Route path="/leave-note" element={<LeaveNote />} /> */}
                <Route path="*" element={<ErrorComponent />} />
              </Routes>
            </Authenticated>
          }
        />
        <Route path="/render-pdf" element={<RenderPDF />} />
      </Routes>
    </AppShell>
  );
};

export default Pages;
