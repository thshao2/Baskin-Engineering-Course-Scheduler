import * as React from 'react'
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

interface Option {
  option: string;
  value: string;
}

interface CheckboxGroupProps {
  title: string;
  subtitle: string;
  options: Option[];
  state: string[];
  mutator: (state: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, subtitle, options, state, mutator }: CheckboxGroupProps) => {
 
  // Directly compute checked state from `state` prop instead of using internal `values` state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    // Update the state based on the checked/unchecked status
    const updatedState = checked
      ? [...state, value] // Add value if checked
      : state.filter(item => item !== value); // Remove value if unchecked

    mutator(updatedState);
  };

  console.log(`${title}: ${state}`)

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">{title}</FormLabel>
        <Typography sx={{ mt: 0.5 }} variant='subtitle2'>{subtitle}</Typography>
        <FormGroup>
          <Grid
            container
            spacing={0.5}
          >
            {options.map((opt: Option) => (
              <Grid
                size={{xs: 12, lg: options.length > 1 ? 6 : 12}}
                key={opt.value}
                sx={{ display: 'flex', alignItems: 'center' }} // Align items in each grid
              >
                <FormControlLabel
                  control={
                    <Checkbox key={opt.value} value={opt.value} checked={state.includes(opt.value)} onChange={handleChange} />
                  }
                  label={opt.option}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: {xs: '0.75rem', sm: '0.80rem', md: '0.90rem'} } }} // Adjust the font size here
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

// Wrap with React.memo
const MemoizedCheckboxGroup = React.memo(CheckboxGroup);

export default MemoizedCheckboxGroup;
