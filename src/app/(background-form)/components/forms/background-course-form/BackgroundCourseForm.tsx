'use client'

import Select from '../../inputs/Select'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { BackgroundCourseData, useFormContext } from '../../../context/FormContext';

import { InfoData } from '../../../context/FormContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect } from 'react';

import CourseHistoryForm from './CourseHistoryForm';
import { validateBackgroundCourseForm } from '../../../formActions';


export default function BackGroundCoursesForm() {
  const router = useRouter();
  const formContext = useFormContext();

  const {
    studentStatus,
    setBackgroundCourseData,
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

  useEffect(() => {
    if (studentStatus === 'T') {
      setBackgroundCourseData((backgroundCourseData: BackgroundCourseData) => ({ ...backgroundCourseData, completedMajorCourses: [] }));
    }
  }, [studentStatus, setBackgroundCourseData])


  const handleBack = () => {
    formContext.setStepError('');
    setStepLastCompleted(0);
  }

  const handleBackgroundForm = async (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      if (formContext.studentStatus === 'T') {
        formContext.setBackgroundCourseData({ ...formContext.backgroundCourseData, universityReq: { ...formContext.backgroundCourseData.universityReq, coreCourse: '1' } })
      }
      const result = await validateBackgroundCourseForm(formContext.studentStatus, formContext.undergradData, formContext.backgroundCourseData);
      console.log(result);
      if (!result.success) {
        formContext.setStepError(result.errors ? result.errors[0] : 'Invalid Input');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        return;
      }
      formContext.setStepError('');

      if (formContext.backgroundCourseData.completedGeneralEdCourses.includes('C') ||
        formContext.undergradData.writing === '2') {
        formContext.setBackgroundCourseData({ ...formContext.backgroundCourseData, universityReq: { ...formContext.backgroundCourseData.universityReq, entry: true } })
      }
      formContext.setMajorChoices(Array(10).fill(''));
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
            width: '70%',               // Box width set to 50% of the screen width
            mx: 'auto',                 // Horizontally centers the Box using margin auto
            display: 'flex',            // Flexbox layout
            flexDirection: 'column',    // Stacks child components vertically
            alignItems: 'center',       // Centers child components horizontally
            // justifyContent: 'center',   // Centers child components vertically
            // minHeight: '100vh',         // Ensures the Box takes at least the full viewport height
            padding: 1,                 // Adds some padding for aesthetic spacing
          }}
          onSubmit={handleBackgroundForm}
        >
          <Select
            auto=""
            title="Student Status"
            subtitle=""
            inputLabel="Status"
            options={
              [
                { option: 'Incoming First-Year Student', value: 'U' },
                { option: 'Incoming Transfer', value: 'T' },
                { option: 'Continuing Student', value: 'C' }
              ]
            }
            state={formContext.studentStatus}
            mutator={formContext.setStudentStatus}
          />
          {formContext.studentStatus ? (
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
          ) : (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              {/* <Link href='/info'> */}
              <Button variant="contained" color='primary' onClick={handleBack}>
                Back
              </Button>
              {/* </Link> */}
            </Box>
          )}
        </Box>
      </>
    );
  } else {
    return null;
  }
}