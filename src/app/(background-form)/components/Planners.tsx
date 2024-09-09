'use client'


import { useFormContext } from "../context/FormContext";
import {Box, Button, Typography} from '@mui/material' 
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import red from '@mui/material/colors/red'
import { validateAndGeneratePlanners } from "../formActions";



export default function Planner() {
  const router = useRouter();
  const formContext = useFormContext();
  
  const {stepLastCompleted} = useFormContext();

  const handleBack = () => {
    formContext.setStepLastCompleted(3);
  }

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const validateAndGenerateSchedules = async () => {
      const result = await validateAndGeneratePlanners(
        formContext.infoData,
        formContext.studentStatus,
        formContext.undergradData,
        formContext.backgroundCourseData,
        formContext.numCoursesPreference,
        formContext.majorChoices
      );
      if (result.success) {
        console.log(result);
        // setSchedules(result.data);  // Set the schedules received from the server
      } else {
        console.log(result);
        setErrors(result.errors);    // Set the error message if validation fails
      }
    }

    if (stepLastCompleted === 4) {
      // Call server action to validate the form and generate schedules
      validateAndGenerateSchedules();
    } else if (stepLastCompleted === 3) {
      router.replace('/major-course-preferences');
    } else if (stepLastCompleted < 3) {
      router.replace('/info')
    }
  }, [stepLastCompleted, formContext, router]);


  if (formContext.stepLastCompleted === 4) {
    return (
      <>
        <Box
          sx={{
            width: '85%',               
            mx: 'auto',                 // Horizontally centers the Box using margin auto
            display: 'flex',            // Flexbox layout
            flexDirection: 'column',    // Stacks child components vertically
            alignItems: 'center',       // Centers child components horizontally
          }}
        >
         {errors.length > 0 &&
          <Box sx={{mt: 3}}>
            <Typography sx={{fontSize: '1.25rem'}} color={red[300]}>{`Something went wrong. Please read the error messages below for more information:`}</Typography>
            {errors.map((error, index) => (
              <Box key={index} sx={{ mt: 3 }}> {/* Adds margin-bottom to each error */}
                <Typography color="error" sx={{fontSize: '0.85rem'}}>{error}</Typography>
              </Box>
            ))}
          </Box>
          }
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button variant="contained" color='primary' onClick={handleBack}>
              Back
            </Button>
          </Box>
        </Box>
      </>
    );
  } else {
    return null;
  }
}