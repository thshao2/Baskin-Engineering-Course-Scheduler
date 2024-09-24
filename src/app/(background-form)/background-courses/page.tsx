import * as React from 'react';
import Box from '@mui/material/Box';
import BackGroundCoursesForm from '../components/forms/background-course-form/BackgroundCourseForm';


export default function BackgroundCourseInfoForm() {
  return (
    <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <BackGroundCoursesForm/>
        </Box>
    </>

  );
}