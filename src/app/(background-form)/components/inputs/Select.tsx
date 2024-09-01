'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';
import { useFormContext } from '../../context/FormContext';

import TextField from '@mui/material/TextField';

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

const BasicSelect: React.FC<BasicSelectProps> = ({auto, title, subtitle, inputLabel, options, state, mutator}: BasicSelectProps) => {
  const [option, setOption] = React.useState(state ? state : auto);

  // Sync initial state on first render
  React.useEffect(() => {
    if (state !== option) {
      mutator(option);
    }
  }, [state, option, mutator]);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setOption(event.target.value as string);
  //   mutator(event.target.value as string);
  // };

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
    mutator(event.target.value as string);
  };

  console.log(`${title}: ${state}`)

  return (
    <Box sx={{ width: '100%' }}>
        <Typography sx={{mt: 2, mb: 1, fontWeight: 'bold', fontSize: 18}}>
        {title}
        </Typography>
        <Typography sx={{mb: 2, fontSize: 14}}>
        {subtitle}
        </Typography>
      <FormControl fullWidth>
        <InputLabel id={`${inputLabel}-select-label`}>{inputLabel}</InputLabel>
        <Select
          labelId={`${inputLabel}-select-label`}
          id={`${inputLabel}-select`}
          value={option}
          label= {inputLabel}
          onChange={handleChange}
          name = {`${inputLabel}-select`}
        >
            {options.map((opt) => (
              <MenuItem key = {opt.value} value = {opt.value}>{opt.option}</MenuItem>
            ))}
        </Select>
          {/* <TextField
            id= {`${inputLabel}-select`}
            select
            value = {option}
            label = {inputLabel}
            name = {inputLabel}
            onChange={handleChange}
          >
            {options.map((opt) => (
              <MenuItem key = {opt.value} value = {opt.value}>{opt.option}</MenuItem>
            ))}
          </TextField> */}
      </FormControl>
    </Box>
  );
};

const MemoizedBasicSelect = React.memo(BasicSelect);


export default MemoizedBasicSelect;