import { useState } from "react";

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';

import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useFormContext } from "../../../context/FormContext";

import Grid from '@mui/material/Grid2'


const getEnrolledQuarters = (gradDate: string, start: string) => {
  const quarters = ['Winter', 'Spring', 'Fall'];
  const gradYear = Number(gradDate.slice(1));
  const gradQuarter = gradDate.charAt(0);
  let endQuarter;

  if (gradQuarter === 'F') {
    endQuarter = 2;
  } else if (gradQuarter === 'S') {
    endQuarter = 1;
  } else {
    endQuarter = 0;
  }

  const startQuarter = start.charAt(0);
  let startQuarterNum;
  if (startQuarter === 'F') {
    startQuarterNum = 2;
  } else if (startQuarter === 'S') {
    startQuarterNum = 1;
  } else {
    startQuarterNum = 0;
  }

  const startYear = Number(start.slice(1));

  const options = [];

  for (let i = startQuarterNum; i < 3; i++) {
    options.push({ option: `${quarters[i]} ${startYear + 2000}`, value: `${quarters[i].charAt(0)}${startYear}` })
    if (i === endQuarter && gradYear === startYear) {
      return options;
    }
  }

  if (options.length === 3) {
    return options;
  }


  for (let year = startYear + 1; year <= gradYear; year++) {
    // Loop through each quarter
    for (let i = 0; i < 3; i++) {
      options.push({ option: `${quarters[i]} ${year + 2000}`, value: `${quarters[i].charAt(0)}${Number(year) % 2000}` })
      if ((year === gradYear && i === endQuarter) || options.length === 3) {
        return options;
      }
    }

  }
  return options;

}



export default function NumMajorCoursesPreference() {
  const [defaultNumMajorCourses, setDefaultNumMajorCourses] = useState('2');
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  const { infoData } = useFormContext();

  let enrolledQuarters = getEnrolledQuarters(infoData.gradDate, infoData.startPlanner);

  const handleDefaultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultNumMajorCourses(event.target.value as string);
  };

  const handleAdvancedToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvancedMode((prev) => !prev);
  };


  return (
    <Box sx={{ width: '100%'}}>
      <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold', fontSize: 18 }}>
        Preferred Number of Major Courses Per Quarter
      </Typography>
      <Typography sx={{ mb: 2, fontSize: 14 }}>
        {`The suggested Baskin Engineering course load is 2 major classes per quarter (default). However, you may override this setting by choosing a different
            option or by selecting the "Advanced" tab to indiciate the number of major classes you want to take for specific quarters (optional).`}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel control={
          <Switch
            checked={advancedMode}
            onChange={handleAdvancedToggle}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        } label="Advanced Options" />
      </Box>
      {advancedMode ? (
        <Grid
          container
          spacing={0.5}
        >
          {enrolledQuarters.map((opt) => (
            <Grid
              size = {{xs: 6, sm: 4, md: 3, lg: 3}}
              key={opt.value}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ mb: 1, fontSize: 14 }}>
                  {opt.option}
                </Typography>
                <FormControl>
                  <TextField
                    id={`number-courses-${opt.value}`}
                    select
                    defaultValue={defaultNumMajorCourses}
                    sx={{ mb: 2, width: 80 }}
                  >
                    {['1', '2', '3', '4', '5'].map((num) => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <FormControl sx={{ minWidth: 80 }}>
          <TextField
            id="number-courses-per-quarter"
            select
            defaultValue={defaultNumMajorCourses}
            onChange={handleDefaultChange}
          >
            {['1', '2', '3', '4', '5'].map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </FormControl>
      )}
    </Box>

  );
};

