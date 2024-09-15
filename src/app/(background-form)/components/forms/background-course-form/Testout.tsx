import { Typography } from "@mui/material";
import {UndergradData, useFormContext } from "../../../context/FormContext";

import {useState} from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from "@mui/material/Box";



export default function Testout() {
  const { infoData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  const [value, setValue] = useState(backgroundCourseData.completedMajorCourses.includes('CSE20') ? 'true' : 'false');


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value.toString();
    setValue(input);
    if (input === 'false') {
      setBackgroundCourseData((prev) => ({
        ...prev,
        completedMajorCourses: backgroundCourseData.completedMajorCourses.filter(course => course !== 'CSE20')
      }));
    } else {
      setBackgroundCourseData((prev) => ({
        ...prev,
        completedMajorCourses: [...backgroundCourseData.completedMajorCourses, 'CSE20']
      }));
    }
  };

  // console.log(undergradData.testout)

  const renderTestout = () => {
    switch (infoData.major) {
      case 'CS':
        return (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Have you taken or do you plan to take the CSE 20 Testout Exam?</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx = {{
                  mt: 1,
                }}
              >
                <FormControlLabel value="false" control={<Radio />} label="No, I will enroll in CSE 20 in my first quarter." />
                <FormControlLabel value="true" control={<Radio />} label="Yes, doing so will allow me to enroll in CSE 30." />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      default:
        return (
          <Typography sx={{ mt: 4 }}>Your major was not found. Please restart the form.</Typography>
        )

    }
  }

  return (
    <>
      {renderTestout()}
    </>
  );

}