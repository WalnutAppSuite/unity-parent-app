import { Box, Burger, Header as MantineHeader, Stack } from "@mantine/core";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons";
import { useGetIdentity } from "@refinedev/core";
import { NavigationContext } from "../../../context/navigation";

interface HeaderProps {
  setNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navbarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ setNavbarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity();
  const { isBackButtonEnabled, isMenuEnabled } = useContext(NavigationContext);

  const handleBackClick = () => {
    if (isBackButtonEnabled) {
      navigate(-1);
    }
  };

  return (
    <MantineHeader
      height={60}
      sx={{
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack justify="center" pl={50} sx={{ height: "100%" }}>
        {location.pathname !== "/" && (
          <Stack
            justify="center"
            align="center"
            p={10}
            w={50}
            sx={{
              position: "absolute",
              left: 45,
              top: 0,
              bottom: 0,
              cursor: isBackButtonEnabled ? "pointer" : "not-allowed",
              opacity: isBackButtonEnabled ? 1 : 0.5,
            }}
          >
            <button
              onClick={handleBackClick}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: isBackButtonEnabled ? 'pointer' : 'not-allowed',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              disabled={!isBackButtonEnabled}
            >
              <IconArrowLeft size={30} stroke={1.5} />
            </button>
          </Stack>
        )}
        {isMenuEnabled && (
          <Stack
            onClick={() => setNavbarOpen((o) => !o)}
            p={10}
            w={50}
            mr={10}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              cursor: "pointer",
            }}
          >
            <Burger opened={false} disabled={!isMenuEnabled} />
          </Stack>
        )}
        <Box
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: "3rem",
          }}
        >
          {location.pathname === "/"
            ? identity
              ? "Communication"
              : "School Board"
            : location.pathname === "/archived"
              ? "Archived Communication"
              : location.pathname === "/archived-files"
                ? "Archived Files"
                : location.pathname === "/calendar"
                  ? "School Calendar"
                  : location.pathname === "/stared"
                    ? "Starred Communication"
                    : location.pathname === "/early-pickup"
                      ? "Early Pick Up"
                      : location.pathname === "/bonafide"
                        ? "Bonafide"
                        : location.pathname === "/fee"
                          ? "Fee"
                          : location.pathname === "/result"
                            ? "Result"
                            : location.pathname === "/timetable"
                              ? "Timetable"
                              : location.pathname === "/wiki"
                                ? "Wiki"
                                : location.pathname === "/leave-note"
                                  ? "Absent Note"
                                  : location.pathname === "/attendance"
                                  ? "Attendance"
                                  : /^\/notice\/([0-9a-f]+)$/.test(location.pathname)
                                    ? ""
                                    : /^\/cmap$/.test(location.pathname)
                                      ? "Curriculum Updates"
                                      : /^\/cmap\/list$/.test(location.pathname)
                                        ? "Curriculum Updates"
                                        : /^\/portion-circular\/list$/.test(location.pathname)
                                          ? "Portion"
                                          : /^\/portion-circular$/.test(location.pathname)
                                            ? "Portion"
                                            : /^\/date-circular$/.test(location.pathname)
                                              ? "Weekly Updates"
                                              : /^\/date-circular\/list$/.test(location.pathname)
                                                ? "Weekly Updates"
                                                : /^\/result/.test(location.pathname)
                                                  ? "Result"
                                                  : location.pathname === "/ptm-link"
                                                    ? "PTM Links"
                                                    : location.pathname === "/student-profile"
                                                      ? "Student Profile"
                                                      : ""}
        </Box>
      </Stack>
    </MantineHeader>
  );
};
