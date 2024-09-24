'use client'

import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import { typographyClasses } from '@mui/joy/Typography';
import Image from 'next/image';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export default function TwoSidedLayout({
  children,
  reversed,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
  const settings = {
    dots: true, // Enable dots for navigation
    infinite: true, // Loop the slides infinitely
    speed: 500, // Animation speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable auto-play
    autoplaySpeed: 5000, // 5 seconds per slide
  };

  const images = [
    'https://api.coarchitects.com/wp-content/uploads/2022/08/COJ124_N1283_print.jpg',
    'https://www.ucsc.edu/wp-content/uploads/2022/10/campus-and-monterey-bay-scaled.jpg',
    'https://collegevine.imgix.net/571e9a11-964f-48a4-83d0-562584d134ac.jpg',
    'https://api.coarchitects.com/wp-content/uploads/2022/08/COJ124_N1287_print.jpg',
    'https://www.capital-engineering.com/wp-content/uploads/2021/10/HERO-UC-Santa-Cruz-Cowell.jpg',
    'https://lpa-design-studios.imgix.net/content/heros/Projects/Higher-Education/UCSC-Silicon-Valley-Campus1.jpg?auto=format&domain=lpa-design-studios.imgix.net&fit=crop&fp-x=0.5&fp-y=0.5&h=1121&ixlib=php-2.1.1&q=60&w=1920',
    'https://d3hxxeuqoz4goo.cloudfront.net/image/s_u_f2ggpsolbk1kwy/f5deef379687c1a638fef392c7e56ba2.original.webp',
  ]
  return (
    <Container
      sx={(theme) => ({
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: reversed ? 'column-reverse' : 'column',
        alignItems: 'center',
        py: 10,
        gap: 4,
        [theme.breakpoints.up(900)]: {
          flexDirection: 'row',
          gap: 6,
        },
        [theme.breakpoints.up(1199)]: {
          gap: 12,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '50ch',
          textAlign: 'center',
          flexShrink: 999,
          // flexShrink: 0, // Prevents the Box from shrinking
          [theme.breakpoints.up(900)]: {
            minWidth: 420,
            alignItems: 'flex-start',
            textAlign: 'initial',
          },
          [`& .${typographyClasses.root}`]: {
            textWrap: 'balance',
          },
        })}
      >
        {children}
      </Box>
      <AspectRatio
        ratio={600 / 520}
        flex
        objectFit="fill"
        variant="outlined"
        maxHeight={300}
        sx={(theme) => ({
          minWidth: '50%', // Take half the screen width
          [theme.breakpoints.down(900)]: {
            width: '100%', // Make the slider take the full width
            maxHeight: '400px',
            height: 'auto', // Let the height adjust automatically
            alignSelf: 'initial',
            flexGrow: 1,
          },
          [theme.breakpoints.up(900)]: {
            height: '100%',
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            left: '50%',
            alignSelf: 'stretch',
            flexGrow: 1,
          },
          borderRadius: 'sm',
          bgcolor: 'background.level2',
          flexBasis: '50%',
        })}
      >
        <Slider {...settings}>
          {images.map((src, index) => (
            <Box
              key={index}
              component="div"
              sx={(theme) => ({
                [theme.breakpoints.down(900)]: {
                  position: 'relative',
                  height: {
                    xs: '400px', // Set a fixed height for mobile view
                    sm: '400px',
                    md: '500px',
                  },
                  width: '5%',
                  display: 'block',
                  overflow: 'hidden',
                },
                [theme.breakpoints.up(900)]: {
                  height: '100vh',
                  display: 'block',
                  overflow: 'hidden',
                  width: '5%',
                  position: 'relative',
                },
              })}
            >
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 100vw, 50vw"
                priority // Loads the images quickly
              />
            </Box>
          ))}
        </Slider>
      </AspectRatio>
    </Container>
  );
}