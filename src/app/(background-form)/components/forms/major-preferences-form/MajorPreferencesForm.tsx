'use client'

import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { useFormContext } from '../../../context/FormContext';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import NumMajorCoursesPreference from './NumMajorCoursesPreference';
import MajorCourseChoices from './MajorCourseChoices';



export default function StduentPreferencesForm() {
  const router = useRouter();
  const formContext = useFormContext();

  const { stepLastCompleted, setStepLastCompleted, infoData } = useFormContext();

  const [isPending, startTransition] = React.useTransition();

  useEffect(() => {
    if (stepLastCompleted === 2) {
      router.replace('/student-preferences');
    } else if (stepLastCompleted === 1) {
      router.replace('/background-courses');
    } else if (stepLastCompleted === 0) {
      router.replace('/info');
    }
  }, [stepLastCompleted, router]);

  useEffect(() => {
    setStepLastCompleted(3);
  }, [setStepLastCompleted])

  const handleBack = () => {
    formContext.setStepError('');
    formContext.setStepLastCompleted(2);
  }


  if (formContext.stepLastCompleted === 3) {
    return (
      <>
        <Box
          component="form"
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
          {infoData.planner === '1' && <NumMajorCoursesPreference />}
          <MajorCourseChoices />
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color='primary' onClick={handleBack}>
              Back
            </Button>
            <Button variant='contained' color='warning'>
              Next
            </Button>
          </Box>
        </Box>
      </>
    );
  } else {
    return null;
  }
}