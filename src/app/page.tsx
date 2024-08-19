import * as React from 'react';
import Box from '@mui/joy/Box';
import CssBaseline from '@mui/joy/CssBaseline';

import ColorSchemeToggle from './components/ColorThemeToggle';


import LandingPage from './components/LandingPage';

export default function StartPage() {
  return (
    <>
      {/* <InitColorSchemeScript defaultMode="system"/>
      <CssVarsProvider defaultMode="system" disableTransitionOnChange theme={framesxTheme}> */}
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
          <LandingPage/>
        </Box>
      {/* </CssVarsProvider> */}
    </>

  );
}

/*
https://github.com/mui/material-ui/blob/master/docs/data/joy/getting-started/templates/framesx-web-blocks/blocks/HeroLeft01.tsx
https://mui.com/joy-ui/getting-started/templates/framesx-web-blocks/
https://m2.material.io/inline-tools/color/
https://zenoo.github.io/mui-theme-creator/#Stepper
*/