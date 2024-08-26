'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';
import { useFormContext } from '../context/FormContext';

interface Option {
  option: string;
  value: string;
}

interface BasicSelectProps {
    auto: string;
    title: string;
    subtitle: string;
    inputLabel: string;
    options: Option[];
    state: string;
    mutator: (state: string) => void;
  }

const BasicSelect = React.memo(({auto, title, subtitle, inputLabel, options, state, mutator}: BasicSelectProps) => {
  const [option, setOption] = React.useState(auto);

  React.useEffect(() => {
    mutator(option);
  }, [mutator, option])

  const handleChange = (event: SelectChangeEvent) => {
    // console.log(event.target.value)
    // mutator(event.target.value as string);
    setOption(event.target.value as string);
  };

  console.log(state);

  return (
    <Box sx={{ width: '100%' }}>
        <Typography sx={{mt: 2, mb: 1, fontWeight: 'bold', fontSize: 18}}>
        {title}
        </Typography>
        <Typography sx={{mb: 2, fontSize: 14}}>
        {subtitle}
        </Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{inputLabel}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label="option"
          onChange={handleChange}
        >
            {options.map((opt) => (
                <MenuItem key = {opt.value} value = {opt.value}>{opt.option}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
});

export default BasicSelect;