import * as React from 'react';
import Box from '@mui/material/Box';
import BackGroundCoursesForm from '../components/forms/background-course-form/BackgroundCourseForm';


export default function BackgroundCourseInfoForm() {
  return (
    <>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            display: 'flex',
            // alignContent: 'center',
            // textAlign: 'center',
            justifyContent: 'center',
            // height: '100vh',
            // overflowY: 'scroll',
            // scrollSnapType: 'y mandatory',
            // '& > div': {
            //   scrollSnapAlign: 'start',
            // },
          }}
        >
          <BackGroundCoursesForm/>
        </Box>
    </>

  );
}