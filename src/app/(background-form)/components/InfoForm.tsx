'use client'

import Select from './Select'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button'

import { useFormContext } from '../context/FormContext';

import {InfoData} from '../context/FormContext';
import { validateInfoForm } from '../formActions';
import React from 'react';
import { useRouter } from 'next/navigation';


const getGradOptions = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  let start = 0;
  if (currentMonth > 4) {
    start = 2;
  } else if (currentMonth > 1) {
    start = 1;
  }

  const possibleGradDates = [];
  const valueGradDates = [];

  const quarters = ['Winter', 'Spring', 'Fall'];

  for (let i = start; i < 3; i++) {
    possibleGradDates.push(`${quarters[i]} ${currentYear}`);
    valueGradDates.push(`${quarters[i].charAt(0)}${Number(currentYear) % 1000}`)
  }

  for (let year = currentYear + 1; year <= currentYear + 5; year++) {
    // Loop through each quarter
    for (let quarter of quarters) {
      // Add the quarter and year to the possibleGradDates array
      possibleGradDates.push(`${quarter} ${year}`);
      valueGradDates.push(`${quarter.charAt(0)}${Number(year) % 1000}`)
    }
  }

  const gradOptions = [];
  for (let i = 0; i < possibleGradDates.length; i++) {
    gradOptions.push({option: possibleGradDates[i], value: valueGradDates[i]});
  }
  return gradOptions;
}

export default function InfoForm() {
  const router = useRouter();
  const gradOptions = getGradOptions();
  const formContext = useFormContext();

  const handleInfoForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await validateInfoForm(formContext.infoData);
    if (!result.success) {
      return;
    }
    formContext.setStepLastCompleted(1);
    router.push('/background-courses');
  }
  
  return (
    <>
      <Box
        component = "form"
        sx={{
          width: '70%',               // Box width set to 50% of the screen width
          mx: 'auto',                 // Horizontally centers the Box using margin auto
          display: 'flex',            // Flexbox layout
          flexDirection: 'column',    // Stacks child components vertically
          alignItems: 'center',       // Centers child components horizontally
          // justifyContent: 'center',   // Centers child components vertically
          // minHeight: '100vh',         // Ensures the Box takes at least the full viewport height
          padding: 1,
          mt: 2,
        }}
        onSubmit={handleInfoForm}
      >
        <Select
          auto="24"
          title="UCSC General Catalog"
          subtitle="If unsure, read about which catalog year you fall into here."
          inputLabel="Year"
          options={
            [
              { option: '2024-2025 (Default)', value: '24' },
              { option: '2023-2024', value: '23' },
              { option: '2022-2023', value: '22' }
            ]
          }
          state = {formContext.infoData.catalogYear}
          mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, catalogYear: value }))}
        />
        <Select
          auto="CS"
          title="Major"
          subtitle=''
          inputLabel="Major"
          options={[{ option: 'Computer Science (B.S.)', value: 'CS' }]}
          state = {formContext.infoData.major}
          mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, major: value }))}
        />
        <Select
          auto=""
          title="Expected Graduation Date"
          subtitle="Your planned last quarter here as an undergraduate at UCSC."
          inputLabel="Date"
          options={gradOptions}
          state = {formContext.infoData.gradDate}
          mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, gradDate: value }))}
        />
        <Select
          auto="1"
          title="I want to generate..."
          subtitle=''
          inputLabel="Planner"
          options={
            [
              { option: 'Planners for the Next 3 Quarters', value: '1' },
              { option: 'Full Academic Planners', value: '2'}
            ]
          }
          state = {formContext.infoData.planner}
          mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, planner: value }))}
        />
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button type= 'submit' variant='contained' color = 'warning'>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
}

/*
https://medium.com/@wdswy/how-to-build-a-multi-step-form-using-nextjs-typescript-react-context-and-shadcn-ui-ef1b7dcceec3
how to make a multi step form using React and Next.js
https://www.reddit.com/r/nextjs/search/?q=multi+step+form&type=link&cId=2a640cd3-7dae-4775-80d2-e059335f58eb&iId=e330d05a-2606-41a0-81e5-965b440b6f00
https://www.reddit.com/r/nextjs/comments/11nq5o4/what_is_the_best_practices_for_creating_multistep/

*/