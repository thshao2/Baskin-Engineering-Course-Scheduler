'use client'

import Select from '../inputs/Select'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { useFormContext } from '../../context/FormContext';

import { InfoData } from '../../context/FormContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

import CourseHistoryForm from './CourseHistoryForm';


export default function BackGroundCoursesForm() {
  const router = useRouter();
  const formContext = useFormContext();

  useEffect(() => {
    if (formContext.stepLastCompleted < 1) {
      router.replace('/info');
    } else {
      formContext.setStepLastCompleted(1);
    }
  }, [formContext.stepLastCompleted, router]);

  const handleBack = () => {
    // formContext.setStepLastCompleted(0);
    router.replace('/info');
  }

  if (formContext.stepLastCompleted === 1) {
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
                <Button variant='contained' color='warning'>
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