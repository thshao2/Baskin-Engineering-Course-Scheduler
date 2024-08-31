import * as React from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

interface Option {
  option: React.ReactNode;
  value: string;
}

interface TwoSelectProps {
  title: string;
  subtitle: string;
  options: Option[];
  state: string;
  mutator: (state: string) => void;
}

const TwoSelect: React.FC<TwoSelectProps> = ({ title, subtitle, options, state, mutator }: TwoSelectProps) => {
  const [value, setValue] = React.useState<string>(state);

  
  // Sync initial state on first render
  React.useEffect(() => {
    if (state !== value) {
      mutator(value);
    }
  }, [state, value, mutator]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value;
    setValue(input);
    mutator(input);
  };

  console.log(`${title}: ${state}`)

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">{title}</FormLabel>
        <Typography sx={{ mt: 0.5 }} variant='subtitle2'>{subtitle}</Typography>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
          sx={{
            mt: 1,
          }}
        >
          {options.map((opt: Option) => (
            <FormControlLabel
              key = {opt.value}
              value={opt.value}
              control={<Radio />}
              label={opt.option}
              sx={{ width: '100%' }} // Ensures full width of the radio buttons
            />
          ))}

        </RadioGroup>
      </FormControl>
    </Box>
  );

};

const MemoizedTwoSelect = React.memo(TwoSelect);


export default MemoizedTwoSelect;