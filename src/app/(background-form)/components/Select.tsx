'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';

interface Option {
    option: string;
    value: string;
}

interface BasicSelectProps {
    auto: string;  // `any` is acceptable here, but consider a more specific type if possible
    title: string;
    subtitle: string;
    inputLabel: string;
    options: Option[]; 
  }

export default function BasicSelect({auto, title, subtitle, inputLabel, options}: BasicSelectProps) {
  const [option, setOption] = React.useState(auto);

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

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
}