/**
 * Utility function to generate input styles based on student profile color
 * 
 * @param studentProfileColor - The color to use for the input border
 * @returns An object with Mantine-compatible styles for inputs
 */
export const getInputStyles = (studentProfileColor?: string) => {
  if (!studentProfileColor) {
    return {
      className: 'walsh-input',
    };
  }

  return {
    className: 'walsh-input-student',
    styles: {
      input: {
        borderColor: `${studentProfileColor} !important`,
        '&:focus': {
          borderColor: `${studentProfileColor} !important`,
        },
      },
      label: {
        color: studentProfileColor,
      },
    },
  };
};

/**
 * Utility function to generate textarea styles based on student profile color
 * 
 * @param studentProfileColor - The color to use for the textarea border
 * @returns An object with Mantine-compatible styles for textareas
 */
export const getTextareaStyles = (studentProfileColor?: string) => {
  if (!studentProfileColor) {
    return {
      className: 'walsh-input',
    };
  }

  return {
    className: 'walsh-input-student',
    styles: {
      input: {
        borderColor: `${studentProfileColor} !important`,
        color: studentProfileColor,
        '&:focus': {
          borderColor: `${studentProfileColor} !important`,
        },
      },
      label: {
        color: studentProfileColor,
      },
    },
  };
};

/**
 * Utility function to generate select styles based on student profile color
 * 
 * @param studentProfileColor - The color to use for the select border
 * @returns An object with Mantine-compatible styles for selects
 */
export const getSelectStyles = (studentProfileColor?: string) => {
  if (!studentProfileColor) {
    return {
      className: 'walsh-input',
    };
  }

  return {
    className: 'walsh-input-student',
    styles: {
      input: {
        borderColor: `${studentProfileColor} !important`,
        '&:focus': {
          borderColor: `${studentProfileColor} !important`,
        },
      },
      label: {
        color: studentProfileColor,
      },
      item: {
        '&[data-selected]': {
          backgroundColor: studentProfileColor,
        },
        '&[data-hovered]': {
          backgroundColor: `${studentProfileColor}22`,
        },
      },
    },
  };
};

/**
 * Utility function to generate date picker styles based on student profile color
 * 
 * @param studentProfileColor - The color to use for the date picker border
 * @returns An object with Mantine-compatible styles for date pickers
 */
export const getDatePickerStyles = (studentProfileColor?: string) => {
  if (!studentProfileColor) {
    return {
      className: 'walsh-input',
    };
  }

  return {
    className: 'walsh-input-student',
    styles: {
      input: {
        borderColor: `${studentProfileColor} !important`,
        color: studentProfileColor,
        '&:focus': {
          borderColor: `${studentProfileColor} !important`,
        },
      },
      label: {
        color: studentProfileColor,
      },
      dropdown: {
        '.mantine-DatePicker-day[data-selected]': {
          backgroundColor: studentProfileColor,
        },
      },
    },
  };
};

/**
 * Utility function to generate inline input styles based on student profile color
 * 
 * @param studentProfileColor - The color to use for the input border
 * @returns An object with inline styles for regular HTML inputs
 */
export const getInlineInputStyles = (studentProfileColor?: string) => {
  if (!studentProfileColor) {
    return {
      outline: 'none',
      padding: '0.5rem',
      borderRadius: '5px',
      border: '1px solid var(--walsh-primary)',
      cursor: 'pointer',
    };
  }

  return {
    outline: 'none',
    padding: '0.5rem',
    borderRadius: '5px',
    border: `1px solid ${studentProfileColor}`,
    cursor: 'pointer',
    color: studentProfileColor,
  };
};

export default getInputStyles;
