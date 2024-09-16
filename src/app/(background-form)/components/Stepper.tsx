"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useFormContext } from '../context/FormContext';

const steps = ['Select Year and Catalog', 'Background Course Information', 'Student Preferences'];

export default function HorizontalLinearStepper() {

  const { stepLastCompleted, stepError } = useFormContext();

  // const [activeStep, setActiveStep] = React.useState(0);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const isStepFailed = (step: number) => {
    return step === stepLastCompleted && stepError.length > 0
  }

  return (
    <Box sx={{
      width: '100%',
      mt: 2,
      '& .MuiStepLabel-label': {
        fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font on small screens
        whiteSpace: { xs: 'break-spaces', sm: 'normal' }, // Allow text to wrap on small screens
      },
      // '& .MuiStepConnector-line': {
      //   minWidth: { xs: '12px', sm: '24px' }, // Smaller spacing between steps on small screens
      // }
    }}>
      <Stepper activeStep={stepLastCompleted} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
            error?: boolean;
          } = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {stepError + '.'}
              </Typography>
            );
            labelProps.error = true;
          }
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          // if (isStepSkipped(index)) {
          //   stepProps.completed = false;
          // }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}