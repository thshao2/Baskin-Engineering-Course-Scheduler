'use client'

import React, { useEffect, useTransition } from 'react';

import Select from '../../inputs/Select'
import StudentSelect from './StudentSelect';
import SubtitleLink from '../../inputs/SubtitleLink'

import { Box, Button, Grid2 as Grid, Typography } from '@mui/material'

import { BackgroundCourseData, useFormContext } from '../../../context/FormContext';

import { InfoData } from '../../../context/FormContext';
import { validateInfoForm } from '../../../formActions';
import { useRouter } from 'next/navigation';

import StartTerm from './StartTerm';
import StartPlanner from './StartPlanner';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CollegeOptions from './CollegeAffiliation';

const getGradOptions = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  let start = 0;
  if (currentMonth >= 10) {
    start = 3;
  } else if (currentMonth > 3 && currentMonth < 10) {
    start = 2;
  } else if (currentMonth > 0) {
    start = 1;
  }

  const possibleGradDates = [];
  const valueGradDates = [];

  const quarters = ['Winter', 'Spring', 'Fall'];

  for (let i = start; i < 3; i++) {
    possibleGradDates.push(`${quarters[i]} ${currentYear}`);
    valueGradDates.push(`${quarters[i].charAt(0)}${Number(currentYear) % 2000}`)
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
    gradOptions.push({ option: possibleGradDates[i], value: valueGradDates[i] });
  }
  return gradOptions;
}

export default function InfoForm() {
  const router = useRouter();
  const gradOptions = getGradOptions();
  const formContext = useFormContext();

  const { studentStatus, setStepLastCompleted } = useFormContext();

  useEffect(() => {
    setStepLastCompleted(0);
  }, [setStepLastCompleted]);

  const [isPending, startTransition] = useTransition();

  const handleInfoForm = async (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await validateInfoForm(formContext.infoData, formContext.studentStatus);
      if (!result.success) {
        formContext.setStepError(result.errors[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        return;
      }
      formContext.setStepError('');
      formContext.setStepLastCompleted(1);
      router.push('/background-courses');
    })
  }


  return (
    <>
      <Box
        component="form"
        sx={{
          width: '90%',               // Box width set to 50% of the screen width
          mx: 'auto',                 // Horizontally centers the Box using margin auto
          display: 'flex',            // Flexbox layout
          flexDirection: 'column',    // Stacks child components vertically
          alignItems: 'center',       // Centers child components horizontally
          padding: 1,
          mt: 1,
        }}
        onSubmit={handleInfoForm}
      >

        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              auto="24"
              title="UCSC General Catalog"
              subtitle={
                <>
                  <Typography
                    sx={{ mt: 1, fontSize: 14, mb: 2 }}>
                    {`If you are unsure which General Catalog you are following, you can read more about catalog rights `}
                    <SubtitleLink
                      href="https://registrar.ucsc.edu/navigator/section1/catalog-rights.html"
                      icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
                    >
                      here
                    </SubtitleLink>.
                  </Typography>
                </>
              }
              inputLabel="Year"
              options={
                [
                  { option: '2024-2025 (Default)', value: '24' },
                  { option: '2023-2024', value: '23' },
                  { option: '2022-2023', value: '22' }
                ]
              }
              state={formContext.infoData.catalogYear}
              mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, catalogYear: value }))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              auto="CS"
              title="Major"
              subtitle="Proposed or Declared Major. Currently, only Computer Science (B.S.) is supported."
              inputLabel="Major"
              options={[{ option: 'Computer Science (B.S.)', value: 'CS' }]}
              state={formContext.infoData.major}
              mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, major: value }))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StudentSelect
              auto=""
              title="Student Status"
              subtitle="Please indicate whether you are an incoming first-year, transfer, or continuing student."
              inputLabel="Status"
              options={
                [
                  { option: 'Incoming First-Year Student', value: 'U' },
                  { option: 'Incoming Transfer', value: 'T' },
                  { option: 'Continuing Four-Year Student', value: 'C' },
                  { option: 'Continuing Transfer Student', value: 'CT'},
                ]
              }
              state={formContext.studentStatus}
              mutator={formContext.setStudentStatus}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              auto="S28"
              title="Expected Graduation Date"
              subtitle="Select your expected last quarter as an undergraduate at UCSC."
              inputLabel="Date"
              options={gradOptions}
              state={formContext.infoData.gradDate}
              mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, gradDate: value }))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              auto="3"
              title="Planner Type"
              subtitle="I want to generate a planner for..."
              inputLabel="Planner"
              options={
                [
                  { option: 'Next Quarter', value: '3' },
                  { option: 'Upcoming 3 Quarters', value: '1' },
                  { option: 'Full Academic Planner (to graduation date)', value: '2' }
                ]
              }
              state={formContext.infoData.planner}
              mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, planner: value }))}
            />
          </Grid>
          {['U', 'T', 'C', 'CT'].includes(studentStatus) && (
            <Grid size={{ xs: 12, md: 6 }}>
              <StartTerm />
            </Grid>
          )}
          {(studentStatus === 'C' || studentStatus === 'U') && (
            <Grid size={{ xs: 12, md: 6 }}>
              <CollegeOptions
                state={formContext.infoData.college}
                mutator={(value) => formContext.setInfoData((prev: InfoData) => ({ ...prev, college: value }))}
              />
            </Grid>
          )}
          {studentStatus.includes('C') && (
            <Grid size={{ xs: 12, md: 6 }}>
              <StartPlanner />
            </Grid>
          )}

        </Grid>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button type='submit' disabled={isPending} variant='contained' color='warning'>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );

}
