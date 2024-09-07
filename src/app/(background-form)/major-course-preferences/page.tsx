import * as React from 'react';
import Box from '@mui/material/Box';

import MajorPreferencesFrom from '../components/forms/major-preferences-form/MajorPreferencesForm'


export default function MajorCoursePreferencesForm() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <MajorPreferencesFrom />
      </Box>
    </>

  );
}