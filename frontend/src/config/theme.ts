import { ColorScheme, MantineThemeOverride } from "@mantine/core";

// Walsh color scheme
export const walshColors = {
  // Main colors
  primary: "#005E5F", // Main primary color
  secondary: "#E2DF8A", // Secondary color

  // Additional colors
  lightBlue: "#AAE1FF", // Light blue accent
  purple: "#6D3BEA", // Purple accent
  orange: "#F27841", // Orange accent
  red: "#ED1651", // Red accent

  // Neutrals
  white: "#F5F7F8", // White/light background
  black: "#000000", // Black text

  // Shades of primary (generated)
  primaryLight: "#007F80",
  primaryLighter: "#009B9C",
  primaryDark: "#004B4C",
  primaryDarker: "#003A3B",

  // Shades of secondary (generated)
  secondaryLight: "#ECEDB0",
  secondaryLighter: "#F5F6D6",
  secondaryDark: "#C5C278",
  secondaryDarker: "#A8A566",
};

// Generate color arrays for Mantine
const generateColorArray = (
  baseColor: string
): [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
] => {
  // This is a simplified version - in a real app you might want to use a color library
  // to generate proper color scales with different shades
  return [
    baseColor, // 0
    baseColor, // 1
    baseColor, // 2
    baseColor, // 3
    baseColor, // 4
    baseColor, // 5
    baseColor, // 6
    baseColor, // 7
    baseColor, // 8
    baseColor, // 9
  ];
};

const theme = (colorScheme: ColorScheme): MantineThemeOverride => ({
  colorScheme: colorScheme,
  fontFamily: "Inter, sans-serif",
  globalStyles: (_theme) => ({
    body: {
      backgroundColor: colorScheme === "dark" ? "#121212" : walshColors.white,
      color: colorScheme === "dark" ? walshColors.white : walshColors.black,
    },
    a: {
      color: walshColors.primary,
      "&:hover": {
        color: walshColors.primaryLight,
      },
    },
  }),
  colors: {
    // Define color arrays for Mantine
    primary: generateColorArray(walshColors.primary),
    secondary: generateColorArray(walshColors.secondary),
    lightBlue: generateColorArray(walshColors.lightBlue),
    purple: generateColorArray(walshColors.purple),
    orange: generateColorArray(walshColors.orange),
    red: generateColorArray(walshColors.red),
  },
  primaryColor: "primary",
  primaryShade: 5,
  defaultRadius: "md",
  // Component overrides
  components: {
    Button: {
      defaultProps: {
        color: "primary",
      },
      styles: (_theme) => ({
        root: {
          "&:hover": {
            backgroundColor: walshColors.primaryLight,
          },
        },
      }),
    },
    Card: {
      defaultProps: {
        shadow: "sm",
      },
    },
    Input: {
      defaultProps: {
        variant: "filled",
      },
    },
  },
});

export default theme;
