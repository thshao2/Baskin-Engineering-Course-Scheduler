"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useFormContext } from '../context/FormContext';

const steps = ['Student Information', 'Background Course History', 'Schedule Preferences'];

export default function HorizontalLinearStepper() {

  const { stepLastCompleted, stepError } = useFormContext();

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