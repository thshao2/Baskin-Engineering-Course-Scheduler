import * as React from 'react';
import Box from '@mui/joy/Box';
import BackGroundCoursesForm from '../components/forms/BackgroundCourseForm';
import StduentPreferencesForm from '../components/forms/StudentPreferencesForm';


export default function BackgroundCourseInfoForm() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StduentPreferencesForm />
      </Box>
    </>

  );
}