import { Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/mantine";

import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { authProvider } from "./providers/auth";
import "./index.css";
import theme from "./config/theme.ts";
import provider from "./providers/data";
import Pages from "./pages/pages.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import PendingFormsChecker from "./components/pending-form-dialog/index.tsx";

import { PendingFormsProvider } from "./context/PendingFormsContext";
import { NavigationProvider } from "./context/navigation";

const queryClient = new QueryClient();

function App() {
  const notificationProvider = useNotificationProvider();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const { t, i18n } = useTranslation();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  // Determine which basename to use based on the current URL
  const getCurrentBasename = () => {
    const path = window.location.pathname;
    if (path.startsWith("/tgaa-connect")) {
      return "/tgaa-connect";
    }
    return "/walsh"; // Default to /walsh
  };

  return (
    <BrowserRouter basename={getCurrentBasename()}>
      <QueryClientProvider client={queryClient}>
        <PendingFormsProvider>
          <NavigationProvider>
            <RefineKbarProvider>
              <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
              >
                {/* You can change the theme colors here. example: theme={{ ...RefineThemes.Magenta, colorScheme:colorScheme }} */}
                <MantineProvider
                  theme={theme(colorScheme)}
                  withNormalizeCSS
                  withGlobalStyles
                >
                  <Global
                    styles={{
                      body: {
                        WebkitFontSmoothing: "auto",
                        backgroundColor: "var(--walsh-bg)",
                        color: "var(--walsh-text)",
                      },
                      a: {
                        color: "var(--walsh-primary)",
                        textDecoration: "none",
                      },
                      "a:hover": {
                        color: "var(--walsh-primary-light)",
                      },

                      ".mantine-Button-root:hover": {
                        backgroundColor: "var(--walsh-primary-light)",
                      },
                      ".mantine-Button-outline": {
                        backgroundColor: "transparent",
                        color: "var(--walsh-primary)",
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-Button-outline:hover": {
                        backgroundColor: "var(--walsh-primary-lighter)",
                        color: "var(--walsh-white)",
                      },
                      ".mantine-Input-input": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-Input-input:focus": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-Select-input": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-Select-input:focus": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-Textarea-input": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-Textarea-input:focus": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-DatePicker-input": {
                        borderColor: "var(--walsh-primary)",
                      },
                      ".mantine-DatePicker-input:focus": {
                        borderColor: "var(--walsh-primary)",
                      },
                    }}
                  />
                  <NotificationsProvider position="top-right">
                    <DevtoolsProvider>
                      <Refine
                        dataProvider={provider}
                        notificationProvider={notificationProvider}
                        routerProvider={routerBindings}
                        authProvider={authProvider}
                        i18nProvider={i18nProvider}
                        resources={[
                          {
                            name: "School Notice",
                            list: "/",
                            show: "/notice/:id",
                            meta: {
                              dataProviderName: "notices",
                            },
                          },
                        ]}
                        options={{
                          syncWithLocation: true,
                          warnWhenUnsavedChanges: true,
                          useNewQueryKeys: true,
                          projectId: "QlcuD4-yeUftx-Pd8nc4",
                        }}
                      >
                        <PendingFormsChecker />
                        <Pages />
                        <RefineKbar />
                        <UnsavedChangesNotifier />
                        <DocumentTitleHandler />
                      </Refine>
                    </DevtoolsProvider>
                  </NotificationsProvider>
                </MantineProvider>
              </ColorSchemeProvider>
            </RefineKbarProvider>
          </NavigationProvider>
        </PendingFormsProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
