import { defaultTheme } from 'react-admin';

export const purpleTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: '#7B1FA2', // Purple color from your React Native app
    },
    secondary: {
      main: '#9C27B0', // Lighter purple
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#7B1FA2',
          color: '#ffffff !important', // White text with important
          '&:hover': {
            backgroundColor: '#6A1B9A',
            color: '#ffffff !important', // White text on hover
          },
          '&:disabled': {
            backgroundColor: '#cccccc',
            color: '#666666 !important',
          },
        },
        contained: {
          backgroundColor: '#7B1FA2',
          color: '#ffffff !important',
          '&:hover': {
            backgroundColor: '#6A1B9A',
            color: '#ffffff !important',
          },
        },
        outlined: {
          borderColor: '#7B1FA2',
          color: '#7B1FA2',
          '&:hover': {
            backgroundColor: '#7B1FA2',
            color: '#ffffff !important',
          },
        },
        text: {
          color: '#7B1FA2',
          '&:hover': {
            backgroundColor: '#E1BEE7',
            color: '#7B1FA2',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7B1FA2',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f8f9fa',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#E1BEE7',
            color: '#7B1FA2',
            '&:hover': {
              backgroundColor: '#CE93D8',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#7B1FA2',
          color: '#ffffff',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#7B1FA2',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#6A1B9A',
          },
        },
      },
    },
    // Additional styling for React Admin specific components
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            color: '#ffffff !important',
          },
        },
      },
    },
    // Style for React Admin's SaveButton and other action buttons
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          '& .MuiButton-root': {
            color: '#ffffff !important',
          },
        },
      },
    },
  },
}; 