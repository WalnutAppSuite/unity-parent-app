import { walshColors } from '../config/theme';

/**
 * A hook to access Walsh color scheme in React components
 * 
 * @returns The Walsh color scheme object
 */
export const useWalshColors = () => {
  return walshColors;
};

/**
 * Get a CSS variable value from the Walsh color scheme
 * 
 * @param variableName The name of the CSS variable (without the -- prefix)
 * @returns The CSS variable value
 */
export const getWalshCssVar = (variableName: string): string => {
  return `var(--walsh-${variableName})`;
};

/**
 * Get a color from the Walsh color scheme
 * 
 * @param colorName The name of the color in the Walsh color scheme
 * @returns The color value
 */
export const getWalshColor = (colorName: keyof typeof walshColors): string => {
  return walshColors[colorName];
};

export default useWalshColors;
