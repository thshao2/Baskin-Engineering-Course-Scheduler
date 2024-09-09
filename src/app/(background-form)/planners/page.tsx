import * as React from 'react';
import Box from '@mui/material/Box';
import Planner from '../components/Planners';



export default function PlannersPage() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Planner />
      </Box>
    </>

  );
}