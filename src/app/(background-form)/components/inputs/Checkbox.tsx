import * as React from 'react'
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

interface Option {
  option: string;
  value: string;
}

interface CheckboxGroupProps {
  auto: { [key: string]: boolean }; // Object with string keys and boolean values
  title: string;
  subtitle: string;
  options: Option[];
  state: string[];
  mutator: (state: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ auto, title, subtitle, options, state, mutator }: CheckboxGroupProps) => {
  const [values, setValues] = React.useState(() => {
    return state.reduce((acc, key) => {
      if (key in acc) {
        acc[key] = true;
      }
      return acc;
    }, { ...auto });
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = {...values, [event.target.value]: event.target.checked};
    setValues(newValue);
    mutator(Object.keys(newValue).filter(key => newValue[key]));
  };

  console.log(`${title}: ${state}`)
  // console.log(`${title}: ${JSON.stringify(values)}`)

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
                item
                xs={12} // Full width on smaller screens
                lg={6}  // Half width on large screens
                key={opt.value}
                sx={{ display: 'flex', alignItems: 'center' }} // Align items in each grid
              >
                <FormControlLabel
                  control={
                    <Checkbox key={opt.value} value={opt.value} checked={values[opt.value]} onChange={handleChange} />
                  }
                  label={opt.option}
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
