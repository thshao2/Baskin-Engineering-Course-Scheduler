import * as React from 'react';
import Box from '@mui/joy/Box';
import CssBaseline from '@mui/joy/CssBaseline';

import ColorSchemeToggle from './components/ColorThemeToggle';

import LandingPage from './components/LandingPage';

export default function StartPage() {
  return (
    <>
      <CssBaseline />
      <ColorSchemeToggle />
      <Box
        sx={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          '& > div': {
            scrollSnapAlign: 'start',
          },
        }}
      >
        <LandingPage />
      </Box>
    </>
  );
}
