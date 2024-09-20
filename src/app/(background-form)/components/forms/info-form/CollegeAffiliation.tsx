import { useFormContext } from '@/app/(background-form)/context/FormContext';
import { Box, Typography, Autocomplete, TextField } from '@mui/material'
import { useState, useEffect } from 'react';


type CollegeOption = {
  label: string;
  value: string;
}

type CollegeOptionProps = {
  state: string,
  mutator: (state: string) => void;
}

export default function CollegeOptions({ state, mutator }: CollegeOptionProps) {
  const { studentStatus } = useFormContext();

  // Get the current college value from universityReq.coreCourse or set it to null
  const [value, setValue] = useState<CollegeOption | null>(
    state !== ''
      ? colleges.find((college) => college.value === state) || null
      : null
  );

  // Synchronize the Autocomplete value with the context value when it changes
  useEffect(() => {
    if (state === '' && value !== null) {
      setValue(null);
    }
  }, [state, value]);

  // Handler for college selection
  const handleCollegeChange = (
    event: React.SyntheticEvent,
    newValue: CollegeOption | null, // newValue can be null if nothing is selected
  ) => {
    if (newValue) {
      // Update the backgroundCourseData when a college is selected

      // Update core course value in formContext based on whether student is incoming undergraduate/continuing student
      /*
        Incoming Undergraduate: value of newValue.value
        Continuing Student:
          '1' (completed core course) 
          '2' (two part core course) 
      */
      if (studentStatus === 'U') {
        mutator(newValue.value);
      } else {
        mutator(newValue.value === 'S' ? '2' : '1')
      }
      setValue(newValue);
    } else {
      mutator('')
      setValue(null);
    }
  };

  console.log(`College Affiliation: ${state}`)

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold', fontSize: 18 }}>
        {`College Affiliation`}
      </Typography>
      <Typography sx={{
        mb: 2, fontSize: 14
      }}>
        {studentStatus === 'C' ? 'Select your affiliated college at UCSC.' :
          `Select your affiliated college at UCSC. If you are not sure which college
         you will be affiliated with yet, choose the one you are most interested in or plan to select. You can
         read more about the 10 colleges at UCSC here.`}
      </Typography>
      <Autocomplete
        disablePortal
        options={colleges}
        value={value}
        onChange={handleCollegeChange}
        sx={{ minwidth: 300 }}
        renderInput={(params) => <TextField {...params} label="College" />}
      />
    </Box>
  );
}

const colleges = [
  { label: 'Cowell College', value: 'C' },
  { label: 'Stevenson College', value: 'S' },
  { label: 'Crown College', value: 'T' },
  { label: 'Merrill College', value: 'M' },
  { label: 'Porter College', value: 'P' },
  { label: 'Kresge College', value: 'K' },
  { label: 'Oakes College', value: 'O' },
  { label: 'Rachel Carson College', value: 'R' },
  { label: 'College Nine', value: 'N' },
  { label: 'John R. Lewis College', value: 'J' }
]
