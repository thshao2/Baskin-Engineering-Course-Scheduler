import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TwoSidedLayout from './TwoSidedLayout';

import Link from 'next/link';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { orange } from '@mui/material/colors';

import BaskinEngineeringLogo from './BaskinEngineeringLogo';


export default function LandingPage() {
  return (
    <TwoSidedLayout>
      <Box
        component = 'div'
        sx = {{
          maxWidth: '100%',
          width: '300px',
        }}>
        <BaskinEngineeringLogo/>
      </Box>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        UCSC Academic Course Scheduler
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        A scheduler to generate recommended four-year academic planners, or potential courses for next quarter based on your class standing and major. 
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          my: 2,
          '& > *': { flex: 'auto' },
        }}
      >
        <a 
          href='https://catalog.ucsc.edu/en/current/general-catalog/'
          target="_blank" 
          rel="noopener noreferrer">
            <Button size="lg" variant="outlined" color="neutral" endDecorator={<ArrowOutwardIcon sx = {{fontSize: "xl"}}/>}>
              UCSC Catalog
            </Button>        
        </a>
        <Link href = '/info'>
          <Button size="lg" endDecorator={<ArrowForward sx = {{fontSize: "xl"}}/>}>
            Get Started
          </Button>
        </Link>
      </Box>
        <a 
          href='https://courses.engineering.ucsc.edu/'
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }} // Remove underline by default
          >
          <Typography 
          textColor="text.secondary"
          startDecorator={<CalendarMonthIcon sx={{ fontSize: 'xl3', color: orange[500] }} />}
          endDecorator={<ArrowOutwardIcon sx={{ fontSize: 'xl' }} />}
          sx={{
            // display: 'flex',
            // alignItems: 'center',
            whiteSpace: 'normal', // Allow wrapping
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:hover': {
              textDecoration: 'underline', // Show underline on hover
            },
            width: {
              xs: '300px', // Full width on small screens
              mobile: '450px', // Fixed width above 600px              
            },
            '@media (min-width: 900px)': {
              transform: 'translateX(-20px)',
            },
            textAlign: 'center',
          }}
        >
          Find out when Baskin Engineering courses are offered
        </Typography>
        </a>
      {/* </Box> */}
    </TwoSidedLayout>
  );
}