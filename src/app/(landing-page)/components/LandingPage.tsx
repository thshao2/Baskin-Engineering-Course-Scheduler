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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function LandingPage() {
  return (
    <TwoSidedLayout>
      <Box
        component='div'
        sx={{
          maxWidth: '100%',
          width: '300px',
        }}>
        <BaskinEngineeringLogo />
      </Box>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        UCSC Academic Course Scheduler
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        A scheduler to generate personalized four-year academic planners or find recommended courses for your upcoming terms, tailored to your course history and major.
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
          <Button size="lg" variant="outlined" color="neutral" endDecorator={<ArrowOutwardIcon sx={{ fontSize: "xl" }} />}>
            UCSC Catalog
          </Button>
        </a>
        <Link href='/info'>
          <Button size="lg" endDecorator={<ArrowForward sx={{ fontSize: "xl" }} />}>
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
      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          mt: 4,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          width: '100%',
          textAlign: 'center',
          textColor: 'text.secondary',
          '@media (min-width: 900px)': {
            alignSelf: 'flex-end', // Stick to the bottom of the left side
            textAlign: 'left',
          }
        }}
      >

        {/* Single Link for Material UI and Icon */}
        <Typography
          component="span"
          fontSize="sm"
          textColor="text.secondary"
        >
          <Box
              component="span"
              sx={{
                '&:hover': {
                  '& span::after': {
                    transform: 'scaleX(1)', // Underline appears on hover for the text
                  },
                  '& span': {
                    color: '#2196f3', // Change text color on hover
                  },
                  '& svg': {
                    transform: 'scale(1.2)', // Zoom icon on hover
                    color: '#2196f3', // Change icon color on hover
                  },
                },
              }}
            >
          Designed using Next.js App Router and{' '}
          <a
            href="https://mui.com/material-ui/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit', // Keep the original text color
              position: 'relative',
            }}
          >
            <Box
              component="span"
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -2,
                  width: '100%',
                  height: '2px',
                  bgcolor: '#2196f3',
                  transition: 'transform 0.2s ease-in-out',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                },
                // '&:hover::after': {
                //   transform: 'scaleX(1)', // Underline appears on hover
                // },
                // '&:hover': {
                //   color: '#2196f3', // Change text color on hover
                // },
              }}
            >
              Material UI
            </Box>
            <OpenInNewIcon
              sx={{
                ml: 0.5, // Small margin to separate icon from the text
                fontSize: 'inherit',
                verticalAlign: 'middle', // Align icon with text
                transition: 'transform 0.2s ease-in-out',
                // '&:hover': {
                //   transform: 'scale(1.2)', // Zoom on hover
                //   color: '#2196f3', // Change icon color on hover
                // },
              }}
            />
          </a>
          </Box>
        </Typography>
        
        <Typography fontSize="sm" textColor="text.secondary" sx={{ mt: 2 }}>
          Developed by Timothy Shao
        </Typography>
        <Typography fontSize="sm" textColor="text.secondary" sx={{ mt: 2 }}>
          Email: thshao@ucsc.edu
        </Typography>
      </Box>
    </TwoSidedLayout>
  );
}