'use client'


import { useFormContext } from "../context/FormContext";
import { Box, Button, Typography, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { red, orange, blue, green, cyan, teal, pink, purple } from '@mui/material/colors'
import { validateAndGeneratePlanners } from "../formActions";
import { quarterSchedule, DisplayElement } from "@/app/lib/get-planners";

import { Table, TableHead, TableContainer, TableCell, TableBody, TableRow, Paper } from "@mui/material"

const CSFormat: Record<string, string> = {
  MATH3: 'MATH 3: Precalculus',
  MATH19A: 'MATH 19A: Calculus I',
  MATH19B: 'MATH 19B: Calculus II',
  MATH21: 'MATH 21: Linear Algebra',
  MATH23A: 'MATH 23A: Vector Calculus',
  CSE12: 'CSE 12: Comp Sys/Assembly Lang',
  CSE13S: 'CSE 13S: Comp Sys and C Prog',
  CSE16: 'CSE 16: Appl Discrete Math',
  CSE20: 'CSE 20: Beginning Python',
  CSE30: 'CSE 30: Prog Abs Python',
  CSE40: 'CSE 40: ML Basics',
  AM10: 'AM 10: Math Methods I',
  AM30: 'AM 30: SOE Calculus III',
  ECE30: 'ECE 30: Engr Prin of Elec',
  STAT131: 'STAT 131: Intro Prob Theory',
  CSE101: 'CSE 101: Data Structs & Algs',
  CSE101M: 'CSE 101M: Math Thinking CS',
  CSE102: 'CSE 102: Algorithm Analysis',
  CSE103: 'CSE 103: Computational Models',
  CSE107: 'CSE 107: Probability/Stats',
  CSE114A: 'CSE 114A: Found of Program Lang',
  CSE115A: 'CSE 115A: Intro Software Eng',
  CSE120: 'CSE 120: Computer Architecture',
  CSE130: 'CSE 130: Prin Computer Sys Dsgn',
  CSE185S: 'CSE 185S: Tech Writ Comp Engs',
  CSE195: 'CSE 195: Senior Thesis Research'
};

const format = (course: string) => {
  return CSFormat[course] ? CSFormat[course] : course;
}

const getColor = (course: string) => {
  if (CSFormat[course] !== undefined) {
    return blue[500];
  }
  if (course === 'GE Course') {
    return green[400];
  }
  if (course === 'Elective') {
    return cyan[500];
  }
  if (course === 'Major Elective') {
    return purple['A100'];
  }
  if (course === 'Capstone Elective') {
    return teal['A700'];
  }
  if (course.startsWith('Writing')) {
    return red['A200']
  }
  if (course.startsWith('College Core')) {
    return pink['A200']
  }
  return 'white';
}

const QuarterSkeleton = () => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={1}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  // borderBottom: '1px solid white',
                  padding: '1rem'
                }}
              >
                {/* Skeleton for the Quarter Title */}
                <Skeleton variant="text" width="60%" height={32} sx={{ margin: '0 auto' }} />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Loop to create Skeleton rows for each course */}
            {[...Array(4)].map((_, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    textAlign: 'center',
                    // borderBottom: '1px solid white',
                    padding: '0.5rem'
                  }}
                >
                  {/* Skeleton for course rows */}
                  <Skeleton variant="rectangular" width="80%" height={20} sx={{ margin: '0 auto' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Pagination, Loading Fallback
const Quarter = ({ quarter, courses }: { quarter: string, courses: string[] }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* Table Structure */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', border: '1px solid #78909c' }}>
        <Table aria-label="quarter schedule">

          {/* Table Head for Quarter Title */}
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={1}  // Span the entire row with the title
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' },  // Responsive font size
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight background for the header
                  color: orange['A400'],
                  // borderBottom: '1px solid white',
                  padding: '1rem'
                }}
              >
                {quarter}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body for Courses */}
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    textAlign: 'center',
                    // borderBottom: '1px solid white',
                    color: getColor(course),  // Assuming a dark background
                    padding: '0.5rem'
                  }}
                >
                  {format(course)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};


export default function Planner() {
  const router = useRouter();
  const formContext = useFormContext();

  const { stepLastCompleted } = useFormContext();

  const handleBack = () => {
    formContext.setStepLastCompleted(2);
  }

  const [isLoading, setIsLoading] = useState(true);

  const [displayInfo, setDisplayInfo] = useState<DisplayElement | undefined>(undefined);

  const [schedules, setSchedules] = useState<quarterSchedule[][][] | undefined>([]);

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
        const reorderedSchedules: quarterSchedule[][][] = [
          result.data[3] as quarterSchedule[][],  // Index 3 first
          result.data[2] as quarterSchedule[][],  // Index 2 second
          result.data[4] as quarterSchedule[][],  // Index 4 third (if it exists)
          result.data[1] as quarterSchedule[][],  // Index 1 last
        ].filter(Boolean); // Filters out any undefined elements if an index is out of bounds
        setSchedules(reorderedSchedules as quarterSchedule[][][]);  // Set the schedules received from the server
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
          {/* {schedules &&
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
          } */}
          {schedules && (
            <Box sx={{ width: '100%', mt: 4, mb: 1 }}>
              {schedules.map((scheduleGroup, groupIndex) => (
                <Grid key={groupIndex} container spacing={1}>
                  {/* Loop through each quarterSchedule[] within quarterSchedule[][] */}
                  {scheduleGroup.map((schedule, scheduleIndex) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4 }}
                      key={scheduleIndex}
                      sx={{ display: 'flex', alignItems: 'center' }} // Align items in each grid
                    >
                      {/* Loop through each quarter in quarterSchedule[] */}
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
          )}
        </Box>
      </>
    );
  } else {
    return null;
  }
}

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