'use client'

import Select from '../../inputs/Select'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { useFormContext } from '../../../context/FormContext';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { validateStudentPreferencesForm } from '../../../formActions';
import NumCoursesPreference from './NumCoursesPreference';


export default function StduentPreferencesForm() {
  const router = useRouter();
  const formContext = useFormContext();

  const {stepLastCompleted, setStepLastCompleted, infoData} = useFormContext();

  const [isPending, startTransition] = React.useTransition();

  useEffect(() => {
    if (stepLastCompleted === 1) {
      router.replace('/background-courses');
    } else if (stepLastCompleted === 0) {
      router.replace('/info');
    }
  }, [stepLastCompleted, router]);

  useEffect(() => {
    setStepLastCompleted(2);
  }, [setStepLastCompleted])

  const handleBack = () => {
    formContext.setStepError('');
    formContext.setStepLastCompleted(1);
  }

  const handleStudentPreferencesForm = async (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await validateStudentPreferencesForm(formContext.infoData, formContext.numCoursesPreference)
      console.log(result);
      if (!result.success) {
        formContext.setStepError(result.errors ? result.errors[0] : 'Invalid Input');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        return;
      }
      formContext.setStepError('');
      formContext.setStepLastCompleted(3);
      router.push('/major-course-preferences');
    })
  }


  if (formContext.stepLastCompleted === 2) {
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
          onSubmit={handleStudentPreferencesForm}
        >
          <NumCoursesPreference />
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color='primary' onClick={handleBack}>
              Back
            </Button>
            <Button variant='contained' type= "submit" color='warning' disabled = {isPending}>
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