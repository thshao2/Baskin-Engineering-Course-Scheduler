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

interface MultipleSelectProps {
  auto: string;
  title: string;
  subtitle: string;
  options: Option[];
  state: string;
  mutator: (state: string) => void;
}


const MultipleSelect: React.FC<MultipleSelectProps> = ({auto, title, subtitle, options, state, mutator} : MultipleSelectProps) => {

  const [value, setValue] = React.useState(state ? state : auto);

  // Sync initial state on first render
  React.useEffect(() => {
    if (state !== value) {
      mutator(value);
    }
  }, [state, value, mutator]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value.toString();
    setValue(input);
    mutator(value);
  };

  console.log(`${title}: ${state}`)

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">{title}</FormLabel>
        <Typography sx={{mt: 0.5}} variant='subtitle2'>{subtitle}</Typography>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
          sx={{
            mt: 1,
          }}
        >
          <Grid
            container
            spacing={0.5} // Adds spacing between grid items
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
                  value={opt.value}
                  control={<Radio />}
                  label={opt.option}
                  sx={{ width: '100%' }} // Ensures full width of the radio buttons
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

// Wrap with React.memo
const MemoizedMultipleSelect = React.memo(MultipleSelect);

export default MemoizedMultipleSelect;