import React from "react";

import { useFormContext } from "../../../context/FormContext";

import { Typography, Box, Grid2 as Grid } from "@mui/material";

import { BackgroundCourseData } from "../../../context/FormContext";

import MajorElectives from "./MajorElectives";
import MultipleAutocomplete from "../../inputs/MultipleAutocomplete";
import CheckboxGroup from "../../inputs/Checkbox";
import SubtitleLink from '../../inputs/SubtitleLink';

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const CSMajorCourses = [
  { option: 'MATH 3: Precalculus', value: 'MATH3' },
  { option: 'MATH 19A: Calculus for Science, Engineering, and Mathematics I', value: 'MATH19A' },
  { option: 'MATH 19B: Calculus for Science, Engineering, and Mathematics II', value: 'MATH19B' },
  { option: 'MATH 21: Linear Algebra', value: 'MATH21' },
  { option: 'MATH 23A: Vector Calculus', value: 'MATH23A' },
  { option: 'CSE 12: Computer Systems and Assembly Language and Lab', value: 'CSE12' },
  { option: 'CSE 13S: Computer Systems and C Programming', value: 'CSE13S' },
  { option: 'CSE 16: Applied Discrete Mathematics', value: 'CSE16' },
  { option: 'CSE 20: Beginning Programming in Python', value: 'CSE20' },
  { option: 'CSE 30: Programming Abstractions: Python', value: 'CSE30' },
  { option: 'CSE 40: Machine Learning Basics: Data Analysis and Empirical Methods', value: 'CSE40' },
  { option: 'AM 10: Mathematical Methods for Engineers I', value: 'AM10' },
  { option: 'AM 30: Multivariate Calculus for Engineers', value: 'AM30' },
  { option: 'ECE 30: Engineering Principles of Electronics', value: 'ECE30' },
  { option: 'STAT 131: Introduction to Probability Theory', value: 'STAT131' },
  { option: 'CSE 101: Introduction to Data Structures and Algorithms', value: 'CSE101' },
  { option: 'CSE 101M: Mathematical Thinking for Computer Science', value: 'CSE101M' },
  { option: 'CSE 102: Introduction to Analysis of Algorithms', value: 'CSE102' },
  { option: 'CSE 103: Computational Models', value: 'CSE103' },
  { option: 'CSE 107: Probability and Statistics for Engineers', value: 'CSE107' },
  { option: 'CSE 114A: Foundations of Programming Languages', value: 'CSE114A' },
  { option: 'CSE 115A: Introduction to Software Engineering (DC Requirement)', value: 'CSE115A' },
  { option: 'CSE 120: Computer Architecture', value: 'CSE120' },
  { option: 'CSE 130: Principles of Computer Systems Design', value: 'CSE130' },
  { option: 'CSE 185S: Technical Writing for Computer Science and Engineering (DC Requirement)', value: 'CSE185S' },
  { option: 'CSE 195: Senior Thesis Research (if used for DC Requirement)', value: 'CSE195' }
];

const CSTransferCourses = [
  { option: 'MATH 19A: Calculus for Science, Engineering, and Mathematics I', value: 'MATH19A' },
  { option: 'MATH 19B: Calculus for Science, Engineering, and Mathematics II', value: 'MATH19B' },
  { option: 'MATH 21: Linear Algebra', value: 'MATH21' },
  { option: 'MATH 23A: Vector Calculus', value: 'MATH23A' },
  { option: 'CSE 12: Computer Systems and Assembly Language and Lab', value: 'CSE12' },
  { option: 'CSE 13S: Computer Systems and C Programming', value: 'CSE13S' },
  { option: 'CSE 16: Applied Discrete Mathematics', value: 'CSE16' },
  { option: 'CSE 20: Beginning Programming in Python', value: 'CSE20' },
  { option: 'CSE 30: Programming Abstractions: Python', value: 'CSE30' },
  { option: 'AM 10: Mathematical Methods for Engineers I', value: 'AM10' },
  { option: 'AM 30: Multivariate Calculus for Engineers', value: 'AM30' },
];

const ucodes = [
  'MATH21', 'MATH23A'
]

const CSPrereqAutofill: Record<string, string[]> = {
  MATH19A: ['MATH3'],
  MATH19B: ['MATH19A'],
  MATH21: ['MATH19A'],
  MATH23A: ['MATH19B'],
  CSE12: ['CSE20'],
  CSE13S: ['CSE12'],
  CSE16: ['CSE12', 'MATH19A'],
  CSE30: ['MATH3', 'CSE20'],
  CSE40: ['CSE30', 'MATH19B'],
  AM10: ['MATH3'],
  AM30: ['AM10', 'MATH19B', 'MATH21'],
  ECE30: ['MATH19B'],
  STAT131: ['MATH19B'],
  CSE101: ['MATH19B', 'CSE30', 'CSE13S', 'CSE16'],
  CSE101M: ['CSE101'],
  CSE102: ['CSE101'],
  CSE103: ['CSE101'],
  CSE107: ['CSE16', 'MATH23A', 'AM30'],
  CSE114A: ['CSE101'],
  CSE115A: ['CSE130'],
  CSE120: ['CSE13S'],
  CSE130: ['CSE101'],
  CSE185S: ['CSE101'],
}

const RenderMajorCourses: React.FC = () => {
  const { studentStatus, infoData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  const renderLinearFlowChart = (courses: string[], courseNames: string[]) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap', // Allows wrapping on smaller screens
      }}
    >
      {courses.map((course, index) => (
        <Box
          key={course}
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: { xs: '100%', md: 'auto' }, // Forces line break on small screens
            mb: { xs: 1, md: 0 }, // Adds some spacing on small screens
          }}
        >
          <Typography
            component="span"
            variant="subtitle2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: 12, md: 14 }, // Responsive font size: smaller on xs, normal on md and larger
            }}
          >
            {course}
          </Typography>
          <Typography
            component="span"
            variant="subtitle2"
            sx={{
              ml: 0.5,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: 12, md: 14 }, // Responsive font size: smaller on xs, normal on md and larger
            }}
          >
            {courseNames[index] === '' ? '' : `(${courseNames[index]})`}
          </Typography>
          {index < courses.length - 1 && (
            <ArrowForwardIcon
              sx={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.7)',
                mx: 1,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );


  switch (infoData.major) {
    case 'CS':
      return (
        <>
          <MultipleAutocomplete
            title="Major Courses"
            description={
              <>
                {studentStatus.includes('C') ? (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2, mt: 0.5 }}>
                      {`Please select all major courses that you have completed or have satisfied through transfer credit.`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      {`The following list outlines the required courses for the Computer Science B.S. Major. Note that
                        major requirements may vary depending on the catalog year. You can double check which
                        major courses are required for the catalog year you are following in the `}
                      <SubtitleLink
                        href="https://catalog.ucsc.edu/en/current/general-catalog/"
                        icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
                      >
                        General Catalog
                      </SubtitleLink>.
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                      {`Lower-Division CSE Courses`}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 0.5, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                      {`Entry-Level Calculus Courses`}
                    </Typography>
                    {renderLinearFlowChart(['MATH 3', 'MATH 19A', 'MATH 19B'], ['Precalculus - Not Required', 'Calculus I', 'Calculus II'])}
                    <Grid container spacing={1} sx={{ mt: 2 }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Linear Algebra`}
                        </Typography>
                        {renderLinearFlowChart(['AM 10 / MATH 21'], [''])}
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Multivariate/Vector Calculus`}
                        </Typography>
                        {renderLinearFlowChart(['AM 30 / MATH 23A'], [''])}
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Applied Discrete Mathematics`}
                        </Typography>
                        {renderLinearFlowChart(['CSE 16'], [''])}
                      </Grid>
                    </Grid>
                    <Typography variant="subtitle1" sx={{ mt: 2, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                      {`Computer Systems`}
                    </Typography>
                    {renderLinearFlowChart(['CSE 12', 'CSE 13S'], ['Computer Systems / Assembly Lang', 'Computer Systems and C Programming'])}
                    <Typography variant="subtitle1" sx={{ mt: 2, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                      {`Computer Science and Engineering - Programming (Python)`}
                    </Typography>
                    {renderLinearFlowChart(['CSE 20', 'CSE 30', 'CSE 40'], ['Beginning Programming in Python', 'Programming Abstractions: Python', 'Machine Learning Basics'])}
                    <Typography variant="subtitle1" sx={{ mt: 2, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                      {`Engineering Science`}
                    </Typography>
                    {renderLinearFlowChart(['ECE 30'], [''])}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mt: 1, fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                        {`Upper-Division CSE Courses`}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mt: 0.5, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                        {`Computer Science and Engineering`}
                      </Typography>
                      {renderLinearFlowChart(['CSE 101', 'CSE 101M, CSE 102, CSE 103, CSE 114A, CSE 130'],
                        ['Data Structures and Algorithms', ''])}
                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                            {`Computer Architecture`}
                          </Typography>
                          {renderLinearFlowChart(['CSE 120'], [''])}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                            {`Probability and Statistics`}
                          </Typography>
                          {renderLinearFlowChart(['CSE 107 / STAT 131'], [''])}
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                            {`Disciplinary Communication (DC) Requirement`}
                          </Typography>
                          {renderLinearFlowChart(['CSE 115A, CSE 185S, or CSE 195'], [''])}
                        </Grid>
                      </Grid>
                      <Typography variant="subtitle2" color="info" sx={{ mt: 2 }}>
                        {`Note that selecting a course will automatically select all of its prerequisites.`}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2, mt: 0.5 }}>
                      {`Please select all major courses that you have satisfied through transfer credit.`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      {`The following list outlines some of the transferrable courses that should have been completed prior 
                      to entering UCSC.`}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                      {`Transferrable Lower-Division CSE Courses`}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 0.5, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                      {`Entry-Level Calculus Courses`}
                    </Typography>
                    {renderLinearFlowChart(['MATH 19A', 'MATH 19B'], ['Calculus I', 'Calculus II'])}
                    <Grid container spacing={1} sx={{ mt: 2 }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Linear Algebra`}
                        </Typography>
                        {renderLinearFlowChart(['AM 10 / MATH 21'], [''])}
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Multivariate/Vector Calculus`}
                        </Typography>
                        {renderLinearFlowChart(['AM 30 / MATH 23A'], [''])}
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Applied Discrete Mathematics`}
                        </Typography>
                        {renderLinearFlowChart(['CSE 16'], [''])}
                      </Grid>
                    </Grid>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mt: 2, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                        {`Computer Systems`}
                      </Typography>
                      {renderLinearFlowChart(['CSE 12', 'CSE 13S'], ['Computer Systems / Assembly Lang', 'Computer Systems and C Programming'])}
                      <Typography variant="subtitle1" sx={{ mt: 2, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                        {`Computer Science and Engineering - Programming (Python)`}
                      </Typography>
                      {renderLinearFlowChart(['CSE 20', 'CSE 30'], ['Beginning Programming in Python', 'Programming Abstractions: Python'])}
                      <Typography variant="subtitle2" color="info" sx={{ mt: 2 }}>
                        {`Note that selecting a course will automatically select all of its prerequisites.`}
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            }
            options={studentStatus.includes('C') ? CSMajorCourses : CSTransferCourses}
            addPrereq={CSPrereqAutofill}
            state={backgroundCourseData.completedMajorCourses}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorCourses: arr }))}
          />
          {studentStatus.includes('C') && <MajorElectives />}
        </>
      );
    default:
      return (
        <Typography sx={{ mt: 4 }}>Your major was not found. Please restart the form.</Typography>
      )

  }
}

export default function MajorCourses() {
  return (
    <>
      <RenderMajorCourses />
    </>
  )
}

export function UndergradMathTransfer() {
  const { backgroundCourseData, setBackgroundCourseData } = useFormContext();

  const options = [{ option: 'AM 10 / MATH 21 (Linear Algebra)', value: 'MATH21' }];
  if (backgroundCourseData.completedMajorCourses.includes('MATH19B')) {
    options.push({ option: 'MATH 23A (Multivariate/Vector Calculus)', value: 'MATH23A' });
  }

  return (
    <CheckboxGroup
      title="Additional Transfer Credit for Math Courses"
      subtitle={`If you have additional math courses that you have already satisified through transfer credit, select them below. Otherwise, you may skip this section.`}
      options={options}
      state={backgroundCourseData.completedMajorCourses}
      mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorCourses: arr }))}
    />
  )
}