'use client'

import { useFormContext } from "../context/FormContext";
import { Box, Button, Typography, SelectChangeEvent, Select, MenuItem, Autocomplete, Checkbox, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { blue, red } from '@mui/material/colors'
import { validateAndGeneratePlanners } from "../formActions";
import { quarterSchedule, DisplayElement } from "@/app/lib/get-planners";

import { FilterList } from "@mui/icons-material";

import DisplayInfo from "./DisplayInfo"
import { PlannerInfoDisplaySkeleton } from "./DisplayInfo";

import { QuarterSkeleton } from "./Quarter";
import Quarter from './Quarter'

import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';



export default function Planner() {
  const router = useRouter();
  const formContext = useFormContext();

  const { stepLastCompleted } = useFormContext();

  const handleBack = () => {
    formContext.setStepLastCompleted(2);
  }

  const [isLoading, setIsLoading] = useState(true);

  const [displayInfo, setDisplayInfo] = useState<DisplayElement | undefined>(undefined);

  // Schedules that will be displayed
  const [schedules, setSchedules] = useState<quarterSchedule[][] | undefined>([]);

  // All schedules that were returned from the server, regardless of filtering
  const [filteredSchedules, setFilteredSchedules] = useState<quarterSchedule[][][] | undefined>([]);

  // State to hold user selected filter for number of major courses
  const [numMajorCoursesFilter, setNumMajorCoursesFilter] = useState<string>('');

  // State to hold all updated schedules from filtering of number of major courses
  const [numMajorFilteredSchedules, setNumMajorFilteredSchedules] = useState<quarterSchedule[][]>([]);

  // State to hold user selected major courses for filtering
  const [selectedFilterMajorCourses, setSelectedFilterMajorCourses] = useState<string[]>([]);


  const handleMajorCoursesFilterChange = (event: React.SyntheticEvent, value: { option: string, value: string }[]) => {
    // Extract the "value" property of each selected option
    const selectedCourseValues = value.map((course) => course.value);
    setSelectedFilterMajorCourses(selectedCourseValues);  // Update the state with selected courses' values

    if (schedules && selectedCourseValues.length > 0) {
      const newArr = numMajorFilteredSchedules.filter((schedule: quarterSchedule[]) =>
        selectedCourseValues.every((course) =>
          schedule.some((term) => term.courses.includes(course))));
      setSchedules(newArr);
    } else if (schedules) {
      setSchedules(numMajorFilteredSchedules);
    }
  };

  // Handle filter change
  const handleNumMajorFilterChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;
    setNumMajorCoursesFilter(selectedValue);

    let newFilteredSchedules: quarterSchedule[][] = [];

    // Update schedules based on the selected filter
    if (filteredSchedules && selectedValue !== '' && filteredSchedules[parseInt(selectedValue, 10) - 1]) {
      newFilteredSchedules = filteredSchedules[parseInt(selectedValue, 10) - 1];
      setNumMajorFilteredSchedules(filteredSchedules[parseInt(selectedValue, 10) - 1]);
    }
    if (filteredSchedules && selectedValue === '') {
      const data1 = (filteredSchedules[0] || []) as quarterSchedule[][]; // Ensure this is at least an empty array
      const data2 = (filteredSchedules[1] || []) as quarterSchedule[][]; // Ensure this is at least an empty array
      const data3 = (filteredSchedules[2] || []) as quarterSchedule[][]; // Ensure this is at least an empty array
      const data4 = (filteredSchedules[3] || []) as quarterSchedule[][]; // Ensure this is at least an empty array

      const maxLength = Math.max(data2.length, data3.length, data4.length);
      const combinedSchedule: quarterSchedule[][] = [];

      for (let i = 0; i < maxLength; i++) {
        if (i < data3.length) {
          combinedSchedule.push(data3[i]);
        }
        if (i < data2.length) {
          combinedSchedule.push(data2[i]);
        }
        if (i < data4.length) {
          combinedSchedule.push(data4[i]);
        }
      }
      for (let i = 0; i < data1.length; i++) {
        combinedSchedule.push(data1[i]);
      }
      newFilteredSchedules = combinedSchedule as quarterSchedule[][];
      setNumMajorFilteredSchedules(combinedSchedule as quarterSchedule[][]);
    }
    if (selectedFilterMajorCourses.length > 0) {
      newFilteredSchedules = newFilteredSchedules.filter((schedule: quarterSchedule[]) =>
        selectedFilterMajorCourses.every((course) =>
          schedule.some((term) => term.courses.includes(course))));
      setSchedules(newFilteredSchedules);
    } else {
      setSchedules(newFilteredSchedules);
    }

  };


  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const validateAndGenerateSchedules = async () => {
      setIsLoading(true);
      const result = await validateAndGeneratePlanners(
        formContext.infoData,
        formContext.studentStatus,
        formContext.undergradData,
        formContext.backgroundCourseData,
        formContext.numCoursesPreference,
      );
      if (result.success) {
        console.log(result);
        setErrors([]);
        setDisplayInfo(result.data[0]);
        setFilteredSchedules(result.data.slice(1) as quarterSchedule[][][]);
        const data1 = (result.data[1] || []) as quarterSchedule[][]; // Ensure this is at least an empty array
        const data2 = (result.data[2] || []) as quarterSchedule[][]; // Ensure this is at least an empty array
        const data3 = (result.data[3] || []) as quarterSchedule[][]; // Ensure this is at least an empty array
        const data4 = (result.data[4] || []) as quarterSchedule[][]; // Ensure this is at least an empty array

        const maxLength = Math.max(data2.length, data3.length, data4.length);
        const combinedSchedule: quarterSchedule[][] = [];

        for (let i = 0; i < maxLength; i++) {
          if (i < data3.length) {
            combinedSchedule.push(data3[i]); // Add from result.data[3] if available
          }
          if (i < data2.length) {
            combinedSchedule.push(data2[i]); // Add from result.data[2] if available
          }
          if (i < data4.length) {
            combinedSchedule.push(data4[i]); // Add from result.data[4] if available
          }
        }
        for (let i = 0; i < data1.length; i++) {
          combinedSchedule.push(data1[i]);
        }
        setNumMajorFilteredSchedules(combinedSchedule as quarterSchedule[][])
        setSchedules(combinedSchedule as quarterSchedule[][]);  // Set the schedules received from the server
      } else {
        console.log(result);
        setErrors(result.errors);    // Set the error message if validation fails
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    }

    if (stepLastCompleted === 3) {
      // Call server action to validate the form and generate schedules
      validateAndGenerateSchedules();
    } else if (stepLastCompleted === 2) {
      router.replace('/student-preferences');
    } else if (stepLastCompleted < 2) {
      router.replace('/info')
    }
  }, [stepLastCompleted, formContext, router]);

  if (isLoading) {
    return (
      <>
        <Box
          sx={{
            width: '85%',
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button variant="contained" color='primary' onClick={handleBack}>
              Back
            </Button>
          </Box>
          <Box
            sx={{
              width: '100%',
              mt: 4,
            }}
          >
            <PlannerInfoDisplaySkeleton />
            <Grid container spacing={1}>
              {/* Create 3 skeleton planners as a placeholder */}
              {[...Array(24)].map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <QuarterSkeleton />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </>
    )
  }


  if (formContext.stepLastCompleted === 3) {
    return (
      <>
        <Box
          sx={{
            width: '85%',
            mx: 'auto',                 // Horizontally centers the Box using margin auto
            display: 'flex',            // Flexbox layout
            flexDirection: 'column',    // Stacks child components vertically
            alignItems: 'center',       // Centers child components horizontally
            justifyContent: 'flex-start'
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button variant="contained" color='primary' onClick={handleBack}>
              Back
            </Button>
          </Box>
          {errors.length > 0 &&
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontSize: '1.25rem' }} color={red[300]}>{`Something went wrong. Please read the error messages below for more information:`}</Typography>
              {errors.map((error, index) => (
                <Box key={index} sx={{ mt: 3 }}> {/* Adds margin-bottom to each error */}
                  <Typography color="error" sx={{ fontSize: '1.00rem' }}>{error}</Typography>
                </Box>
              ))}
            </Box>
          }
          {displayInfo && <DisplayInfo displayInfo={displayInfo} />}
          {(schedules && filteredSchedules) &&
            <>
              {/* Filtering Select for Number of major courses */}
              <Box sx={{ width: '100%', mt: 1, mb: 1, display: 'flex', alignItems: 'center' }}>
                {/* Filter Icon */}
                <FilterList sx={{ color: blue[500], mr: 1 }} />

                {/* Typography for filter label */}
                <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold', fontSize: 16 }}>
                  Filter by Number of Major Courses in Schedule:
                </Typography>

                {/* Select component for filtering */}
                <Select
                  value={numMajorCoursesFilter}
                  onChange={handleNumMajorFilterChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Filter by major courses' }}
                  sx={{ minWidth: 120, backgroundColor: 'background.paper', borderRadius: 1 }}
                >
                  {/* Default "No Filter" option */}
                  <MenuItem value="">
                    <em>No Filter</em>
                  </MenuItem>

                  {/* Dynamic options based on filteredSchedules */}
                  {[...Array(filteredSchedules.length)].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {`${index + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {/* Filtering Autocomplete for major courses */}
              <Box sx={{ width: '100%', mt: 4, mb: 1 }}>
                {/* First row: Filter icon and Typography */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {/* Filter Icon */}
                  <SearchIcon sx={{ color: blue[500], mr: 1 }} />

                  {/* Typography for filter label */}
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2, fontSize: 16}}>
                    Generated Schedules Should Include the Following Courses:
                  </Typography>
                </Box>

                {/* Second row: Autocomplete for filtering */}
                <Box>
                  <Autocomplete
                    multiple
                    id="checkboxes-major-courses-filter"
                    limitTags={5}
                    options={optionsArr}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.option}
                    onChange={handleMajorCoursesFilterChange}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.option}
                        </li>
                      );
                    }}
                    style={{ minWidth: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Filter by Major Courses..." placeholder="Courses" />
                    )}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '100%', mt: 4, mb: 1 }}>
                <Grid container spacing={1}>
                  {schedules.map((schedule, scheduleIndex) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }} // Align items in each grid
                      key={scheduleIndex}>
                      {schedule.map((quarter, index) => (
                        <Quarter key={index} quarter={quarter.quarter} courses={quarter.courses} />
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          }
        </Box >
      </>
    );
  } else {
    return null;
  }
}

const optionsArr = [
  { option: 'MATH 3: Precalculus', value: 'MATH3' },
  { option: 'MATH 19A: Calculus I', value: 'MATH19A' },
  { option: 'MATH 19B: Calculus II', value: 'MATH19B' },
  { option: 'MATH 21: Linear Algebra', value: 'MATH21' },
  { option: 'MATH 23A: Vector Calculus', value: 'MATH23A' },
  { option: 'CSE 12: Comp Sys/Assembly Lang', value: 'CSE12' },
  { option: 'CSE 13S: Comp Sys and C Prog', value: 'CSE13S' },
  { option: 'CSE 16: Appl Discrete Math', value: 'CSE16' },
  { option: 'CSE 20: Beginning Python', value: 'CSE20' },
  { option: 'CSE 30: Prog Abs Python', value: 'CSE30' },
  { option: 'CSE 40: ML Basics', value: 'CSE40' },
  { option: 'AM 10: Math Methods I', value: 'AM10' },
  { option: 'AM 30: SOE Calculus III', value: 'AM30' },
  { option: 'ECE 30: Engr Prin of Elec', value: 'ECE30' },
  { option: 'STAT 131: Intro Prob Theory', value: 'STAT131' },
  { option: 'CSE 101: Data Structs & Algs', value: 'CSE101' },
  { option: 'CSE 101M: Math Thinking CS', value: 'CSE101M' },
  { option: 'CSE 102: Algorithm Analysis', value: 'CSE102' },
  { option: 'CSE 103: Computational Models', value: 'CSE103' },
  { option: 'CSE 107: Probability/Stats', value: 'CSE107' },
  { option: 'CSE 114A: Found of Program Lang', value: 'CSE114A' },
  { option: 'CSE 115A: Intro Software Eng', value: 'CSE115A' },
  { option: 'CSE 120: Computer Architecture', value: 'CSE120' },
  { option: 'CSE 130: Prin Computer Sys Dsgn', value: 'CSE130' },
  { option: 'CSE 185S: Tech Writ Comp Engs', value: 'CSE185S' },
  { option: 'CSE 195: Senior Thesis Research', value: 'CSE195' }

]


/*

{schedules && 
          schedules.map((schedule, scheduleIndex) => (
            <Box key={scheduleIndex} sx={{ width: '100%', mt: 4, mb: 1 }}>
              { Each schedule displayed in a grid with 3 Quarter components per row } Put /* *\  in {}
              <Grid container spacing={1}>
                {schedule.map((quarter, index) => (
                  <Grid size={{xs: 12, sm: 6, md: 4}} sx={{ display: 'flex', alignItems: 'center' }} // Align items in each grid
                  key={index}>
                    <Quarter quarter={quarter.quarter} courses={quarter.courses} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
*/

/*
{ {schedules && (
            <Box sx={{ width: '100%', mt: 4, mb: 1 }}>
              {schedules.map((scheduleGroup, groupIndex) => (
                <Grid key={groupIndex} container spacing={1}>
                  { Loop through each quarterSchedule[] within quarterSchedule[][] }
                  {scheduleGroup.map((schedule, scheduleIndex) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4 }}
                      key={scheduleIndex}
                      sx={{ display: 'flex', alignItems: 'center' }} // Align items in each grid
                    >
                      { Loop through each quarter in quarterSchedule[] }
                      {schedule.map((quarter, index) => (
                        <Quarter
                          key={index}
                          quarter={quarter.quarter}
                          courses={quarter.courses}
                        />
                      ))}
                    </Grid>
                  ))}
                </Grid>

              ))}
            </Box>
          )} }
*/