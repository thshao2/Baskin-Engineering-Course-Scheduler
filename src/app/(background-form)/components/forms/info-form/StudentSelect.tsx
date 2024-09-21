'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';

import { useFormContext, UndergradData, BackgroundCourseData, InfoData } from '@/app/(background-form)/context/FormContext';
import { codes, tcodes } from '../background-course-form/MajorCourses';

interface Option {
  option: string;
  value: string;
}

interface BasicSelectProps {
  auto: string;
  title: string;
  subtitle: string | React.ReactNode;
  inputLabel: string;
  options: Option[];
  state: string;
  mutator: (state: string) => void;
}

const StudentStatusSelect: React.FC<BasicSelectProps> = ({ auto, title, subtitle, inputLabel, options, state, mutator }: BasicSelectProps) => {
  const [option, setOption] = React.useState(state ? state : auto);

  const { setInfoData, setBackgroundCourseData, setUndergradData } = useFormContext();

  // Sync initial state on first render
  React.useEffect(() => {
    if (state !== option) {
      mutator(option);
    }
  }, [state, option, mutator]);

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as string;
    setOption(newStatus);
    mutator(newStatus);
    if (newStatus === 'U') {
      setBackgroundCourseData((backgroundCourseData: BackgroundCourseData) =>
      ({
        ...backgroundCourseData,
        completedMajorCourses: [],
        completedMajorElectives: [], completedAlternativeElectives: [],
        completedCapstoneElectives: [],
      }));
    } else if (newStatus === 'T') {
      const diffCodes = codes.filter(code => !tcodes.includes(code));
      setBackgroundCourseData((backgroundCourseData: BackgroundCourseData) =>
      ({
        ...backgroundCourseData,
        completedMajorCourses: backgroundCourseData.completedMajorCourses.filter(course => !diffCodes.includes(course)),
        completedMajorElectives: [], completedAlternativeElectives: [],
        completedCapstoneElectives: [],
      }));
    }
    setUndergradData((undergradData: UndergradData) => ({
      ...undergradData, math: ''
    }));
    setInfoData((infoData: InfoData) => ({
      ...infoData, startDate: '', college: '', startPlanner: '',
    }));
  };

  console.log(`${title}: ${state}`)

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold', fontSize: 18 }}>
        {title}
      </Typography>
      {typeof (subtitle) === 'string' ? (
        <Typography sx={{
          mb: 2, fontSize: 14
        }}>
          {subtitle}
        </Typography>
      ) : (
        subtitle
      )}
      <FormControl fullWidth>
        <InputLabel id={`${inputLabel}-select-label`}>{inputLabel}</InputLabel>
        <Select
          labelId={`${inputLabel}-select-label`}
          id={`${inputLabel}-select`}
          value={option}
          label={inputLabel}
          onChange={handleChange}
          name={`${inputLabel}-select`}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StudentStatusSelect;