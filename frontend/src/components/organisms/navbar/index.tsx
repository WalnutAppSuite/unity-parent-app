import {
  Box,
  Burger,
  Navbar as MantineNavbar,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";

import React, { useEffect } from "react";
import {
  IconArchive,
  IconCalendarOff,
  IconLogout,
  IconMessage,
  IconReload,
  // IconStack2,
  IconStar,
  IconCalendar,
  // IconFileDescription,
  IconReport,
  IconUser,
  IconCreditCard,
  // IconLink,
  IconPrinter,
  IconFiles,
} from "@tabler/icons";
// import { IconClock } from "@tabler/icons-react";
// import { IconReport } from "@tabler/icons-react";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { useLocation, useNavigate } from "react-router-dom";
import { IconBook } from "@tabler/icons-react";
import { usePendingForms } from "../../../context/PendingFormsContext";
const isPublicAvailable = import.meta.env.VITE_PUBLIC_AVAILABLE === "true";
interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsOpen, isOpen }) => {
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: identity } = useGetIdentity();
  const { hasPendingForms, isOnFormPage } = usePendingForms();

  useEffect(() => {
    setIsOpen(false);
  }, [location?.pathname]);

  const changeLocation: typeof navigate = (...args) => {
    // @ts-expect-error it works
    navigate(...args);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  // Define which items should always be enabled
  const alwaysEnabledItems = ["Communication", "Logout", "Reload"];

  const navItems = identity
    ? [
        {
          label: "Communication",
          icon: IconMessage,
          location: "/",
          subRoutes: [
            { label: "Communication", icon: IconMessage, location: "/" },
            {
              label: "Starred Communication",
              icon: IconStar,
              location: "/stared",
            },
            {
              label: "Archived Communication",
              icon: IconArchive,
              location: "/archived",
            },
          ],
        },
        { label: "Attendance", icon: IconCalendar, location: "/attendance" },
        {
          label: "Student Profile",
          icon: IconUser,
          location: "/student-profile",
        },
        {
          label: "Bonafide Certificate",
          icon: IconPrinter,
          location: "/bonafide",
        },
        {
          label: "Archived Files",
          icon: IconFiles,
          location: "/archived-files",
        },
        { label: "Fee", icon: IconCreditCard, location: "/fees" },
        { label: "Calendar", icon: IconCalendarOff, location: "/calendar" },
        { label: "Timetable", icon: IconCalendar, location: "/timetable" },
        { label: "Report Card", icon: IconReport, location: "/report-card" },
        {
          label: "Reload",
          icon: IconReload,
          onClick: () => {
            window.location.reload();
          },
        },
        {
          label: "Wiki",
          icon: IconBook,
          location: "/wiki",
        },
        {
          label: "Logout",
          icon: IconLogout,
          onClick: async () => {
            logout();
            setIsOpen(false);
          },
        },
      ]
    : [
        ...(isPublicAvailable
          ? [{ label: "Messages", icon: IconMessage, location: "/" }]
          : []),
        { label: "Login", icon: IconUser, location: "/login" },
        {
          label: "Reload",
          icon: IconReload,
          onClick: () => {
            window.location.reload();
          },
        },
        ...(isPublicAvailable
          ? [{ label: "Register", icon: IconUser, location: "/register" }]
          : []),
      ];

  return (
    <MantineNavbar
      hidden={!isOpen}
      style={{
        backgroundColor: "transparent",
        position: "fixed",
        inset: 0,
        height: "100dvh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#0005",
          position: "absolute",
          inset: 0,
        }}
        onClick={() => setIsOpen(false)}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Stack
          sx={{
            height: 60,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              height: 59,
              width: 60,
              padding: "10px 10px",
            }}
          >
            <Box
              sx={{
                backgroundImage:
                  "url(/assets/edu_quality/walsh/images/tgaa1024.jpg)",
                height: 40,
                width: 40,
                borderRadius: 4,
                backgroundSize: "contain",
              }}
            />
          </Box>
          <Stack
            onClick={() => setIsOpen((o) => !o)}
            justify="center"
            align="center"
            p={10}
            w={50}
            sx={{
              right: 0,
              top: 0,
              bottom: 0,
              cursor: "pointer",
              marginLeft: "auto",
              marginRight: 10,
            }}
          >
            <Burger opened={isOpen} />
          </Stack>
        </Stack>
        {navItems.map((n, index) => {
          // Determine if this item should be disabled
          const isDisabled =
            hasPendingForms &&
            !isOnFormPage &&
            !alwaysEnabledItems.includes(n.label);

          return (
            <NavRoute
              key={index}
              n={n}
              changeLocation={changeLocation}
              disabled={isDisabled}
            />
          );
        })}
        {!identity && (
          <Box p="md">
            <Text size="sm" color="gray">
              Login to see more features
            </Text>
          </Box>
        )}
      </Box>
    </MantineNavbar>
  );
};

interface NavRouteData {
  label: string;
  icon: typeof IconReload;
  location?: string;
  subRoutes?: NavRouteData[];
  onClick?: () => void;
}
function NavRoute({
  n,
  changeLocation,
  disabled = false,
}: {
  n: NavRouteData;
  changeLocation: ReturnType<typeof useNavigate>;
  disabled?: boolean;
}) {
  if (!n.subRoutes)
    return (
      <NavLink
        key={n.label}
        onClick={() => {
          if (!disabled && n.location) {
            changeLocation(n.location);
          } else if (!disabled && n?.onClick) {
            n.onClick();
          }
        }}
        sx={{
          margin: 5,
          boxSizing: "border-box",
          maxWidth: "100%",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          ...(disabled
            ? {
                opacity: 0.5,
                pointerEvents: "none" as const,
                cursor: "not-allowed",
              }
            : {}),
        }}
        label={n.label}
        icon={
          <n.icon
            size={35}
            stroke={1.5}
            color={disabled ? "#999" : "#005E5F"}
          />
        }
      />
    );

  if (n.subRoutes) {
    return (
      <Box
        pb={8}
        sx={{
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          ...(disabled
            ? {
                opacity: 0.5,
                pointerEvents: "none" as const,
                cursor: "not-allowed",
              }
            : {}),
        }}
      >
        <NavLink
          pb={0}
          mb={0}
          key={n.label}
          sx={{
            margin: 5,
            boxSizing: "border-box",
            maxWidth: "100%",
          }}
          childrenOffset={55}
          label={n.label}
          icon={
            <n.icon
              size={35}
              stroke={1.5}
              color={disabled ? "#999" : "#005E5F"}
            />
          }
        >
          {n.subRoutes.map((n) => (
            <NavLink
              key={n.label}
              onClick={() => {
                if (!disabled && n.location) {
                  changeLocation(n.location);
                  return;
                } else if (!disabled && n?.onClick) {
                  n.onClick();
                  return;
                }
              }}
              styles={{
                label: {
                  fontSize: "11px !important",
                  color: disabled ? "#999" : undefined,
                },
              }}
              py={6}
              sx={{
                boxSizing: "border-box",
                maxWidth: "100%",
              }}
              label={n.label}
            />
          ))}
        </NavLink>
      </Box>
    );
  }
  return null;
}
export default Navbar;
