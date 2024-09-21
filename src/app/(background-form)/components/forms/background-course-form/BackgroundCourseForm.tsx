'use client'

import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { useFormContext } from '../../../context/FormContext';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import CourseHistoryForm from './CourseHistoryForm';
import { validateBackgroundCourseForm } from '../../../formActions';


export default function BackGroundCoursesForm() {
  const router = useRouter();
  const formContext = useFormContext();

  const {
    stepLastCompleted,
    setStepLastCompleted } = useFormContext();

  const [isPending, startTransition] = React.useTransition();

  useEffect(() => {
    if (stepLastCompleted < 1) {
      router.replace('/info');
    }
  }, [stepLastCompleted, router]);

  useEffect(() => {
    setStepLastCompleted(1);
  }, [setStepLastCompleted])


  const handleBack = () => {
    formContext.setStepError('');
    setStepLastCompleted(0);
  }

  const handleBackgroundForm = async (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await validateBackgroundCourseForm(formContext.studentStatus, formContext.undergradData, formContext.backgroundCourseData);
      console.log(result);
      if (!result.success) {
        formContext.setStepError(result.errors[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        return;
      }
      formContext.setStepError('');
      formContext.setStepLastCompleted(2);
      router.push('/student-preferences');
    })
  }

  if (formContext.stepLastCompleted === 1) {
    return (
      <>
        <Box
          component="form"
          sx={{
            width: '80%',               // Box width set to 50% of the screen width
            mx: 'auto',                 // Horizontally centers the Box using margin auto
            display: 'flex',            // Flexbox layout
            flexDirection: 'column',    // Stacks child components vertically
            alignItems: 'center',       // Centers child components horizontally
            padding: 1,
          }}
          onSubmit={handleBackgroundForm}
        >
            <>
              <CourseHistoryForm />
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color='primary' onClick={handleBack}>
                  Back
                </Button>
                <Button variant='contained' color='warning' type="submit" disabled={isPending}>
                  Next
                </Button>
              </Box>
            </>
        </Box>
      </>
    );
  } else {
    return null;
  }
}