'use client'

import Select from './Select'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { useFormContext } from '../context/FormContext';



export default function BackGroundCoursesForm() {
  const formContext = useFormContext();

  return (
    <>
      <Box
        sx={{
          width: '70%',               // Box width set to 50% of the screen width
          mx: 'auto',                 // Horizontally centers the Box using margin auto
          display: 'flex',            // Flexbox layout
          flexDirection: 'column',    // Stacks child components vertically
          alignItems: 'center',       // Centers child components horizontally
          // justifyContent: 'center',   // Centers child components vertically
          // minHeight: '100vh',         // Ensures the Box takes at least the full viewport height
          padding: 1,                 // Adds some padding for aesthetic spacing
        }}
      >
        <Select
          auto="24"
          title="UCSC General Catalog"
          subtitle="If unsure, read about which catalog year you fall into here."
          inputLabel="Year"
          options={
            [
              { option: '2024-2025 (Default)', value: '24' },
              { option: '2023-2024', value: '23' },
              { option: '2022-2023', value: '22' }
            ]
          }
          state={formContext.catalogYear}
          mutator={formContext.setCatalogYear}
        />
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant='contained' color='warning'>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
}