'use client'

import React from 'react'

import { useColorScheme } from '@mui/joy/styles';
import IconButton from '@mui/joy/IconButton';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';


export default function ColorSchemeToggle() {
    const {mode, systemMode} = useColorScheme();
    const {setMode} = useColorScheme();
    console.log(mode);
    console.log(systemMode);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
      localStorage.clear();
      setMounted(true);
    }, []);
    if (!mounted) {
      return null;
    }
    return (
      <IconButton
        id="toggle-mode"
        size="lg"
        variant="soft"
        color="neutral"
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
        sx={(theme) => ({
          [theme.breakpoints.down(900)]: {
            position: 'fixed',
            zIndex: 999,
            top: '1rem',
            right: '2rem',
            borderRadius: '50%',
            boxShadow: 'sm',
          },
          [theme.breakpoints.up(900)]: {
            position: 'fixed',
            zIndex: 999,
            top: '1rem',
            right: '51%',
            borderRadius: '50%',
            boxShadow: 'sm',
            flexGrow: 1,
          },
          borderRadius: 'sm',
          bgcolor: 'background.level2',
          flexBasis: '50%',
        })}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    );
  }