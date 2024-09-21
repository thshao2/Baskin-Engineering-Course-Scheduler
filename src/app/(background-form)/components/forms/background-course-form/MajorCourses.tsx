import { useFormContext } from "../../../context/FormContext";

import { Typography, Box } from "@mui/material";
import CheckboxResponsive from "../../inputs/CheckboxResponsive";
import CheckboxGroup from "../../inputs/Checkbox";

import { BackgroundCourseData } from "../../../context/FormContext";
import React, { useEffect, useState } from "react";

import MajorElectives from "./MajorElectives";
import MultipleAutocomplete from "../../inputs/MultipleAutocomplete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export const codes = [
  'MATH3', 'MATH19A', 'MATH19B', 'MATH21', 'MATH23A',
  'CSE12', 'CSE13S', 'CSE16', 'CSE20', 'CSE30', 'CSE40',
  'AM10', 'AM30', 'ECE30', 'STAT131',
  'CSE101', 'CSE101M', 'CSE102', 'CSE103', 'CSE107', 'CSE114A', 'CSE115A', 'CSE120', 'CSE130', 'CSE185S', 'CSE195'
]

const majorLabels = [
  'MATH 3: Precalculus',
  'MATH 19A: Calculus for Science, Engineering, and Mathematics I',
  'MATH 19B: Calculus for Science, Engineering, and Mathematics II',
  'MATH 21: Linear Algebra', 'MATH 23A: Vector Calculus',
  'CSE 12: Computer Systems and Assembly Language and Lab', 'CSE 13S: Computer Systems and C Programming',
  'CSE 16: Applied Discrete Mathematics', 'CSE 20: Beginning Programming in Python',
  'CSE 30: Programming Abstractions: Python', 'CSE 40: Machine Learning Basics: Data Analysis and Empirical Methods',
  'AM 10: Mathematical Methods for Engineers I', 'AM 30: Multivariate Calculus for Engineers',
  'ECE 30: Engineering Principles of Electronics', 'STAT 131: Introduction to Probability Theory',
  'CSE 101: Introduction to Data Structures and Algorithms',
  'CSE 101M: Mathematical Thinking for Computer Science',
  'CSE 102: Introduction to Analysis of Algorithms',
  'CSE 103: Computational Models',
  'CSE 107: Probability and Statistics for Engineers',
  'CSE 114A: Foundations of Programming Languages',
  'CSE 115A: Introduction to Software Engineering (DC Requirement)',
  'CSE 120: Computer Architecture',
  'CSE 130: Principles of Computer Systems Design',
  'CSE 185S: Technical Writing for Computer Science and Engineering (DC Requirement)',
  'CSE 195: Senior Thesis Research (if used for DC Requirement)'
] as const;

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

export const tcodes = [
  'MATH19A', 'MATH19B', 'MATH21', 'MATH23A',
  'CSE12', 'CSE13S', 'CSE16', 'CSE20', 'CSE30', 'CSE40',
  'AM10', 'AM30', 'ECE30', 'STAT131', 'CSE101', 'CSE107'
]

const tmajorLabels = [
  'MATH 19A: Calculus for Science, Engineering, and Mathematics I',
  'MATH 19B: Calculus for Science, Engineering, and Mathematics II',
  'MATH 21: Linear Algebra', 'MATH 23A: Vector Calculus',
  'CSE 12: Computer Systems and Assembly Language and Lab', 'CSE 13S: Computer Systems and C Programming',
  'CSE 16: Applied Discrete Mathematics', 'CSE 20: Beginning Programming in Python',
  'CSE 30: Programming Abstractions: Python', 'CSE 40: Machine Learning Basics: Data Analysis and Empirical Methods',
  'AM 10: Mathematical Methods for Engineers I', 'AM 30: Multivariate Calculus for Engineers',
  'ECE 30: Engineering Principles of Electronics', 'STAT 131: Introduction to Probability Theory',
  'CSE 101: Introduction to Data Structures and Algorithms',
  'CSE 107: Probability and Statistics for Engineers',
] as const;

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
  { option: 'CSE 40: Machine Learning Basics: Data Analysis and Empirical Methods', value: 'CSE40' },
  { option: 'AM 10: Mathematical Methods for Engineers I', value: 'AM10' },
  { option: 'AM 30: Multivariate Calculus for Engineers', value: 'AM30' },
  { option: 'ECE 30: Engineering Principles of Electronics', value: 'ECE30' },
  { option: 'STAT 131: Introduction to Probability Theory', value: 'STAT131' },
  { option: 'CSE 101: Introduction to Data Structures and Algorithms', value: 'CSE101' },
  { option: 'CSE 107: Probability and Statistics for Engineers', value: 'CSE107' },
];

const ucodes = [
  'MATH21', 'MATH23A'
]

export const CSAdjList: Record<string, string[]> = {
  MATH3: ['MATH19A', 'AM10', 'CSE30'],
  MATH19A: ['MATH19B', 'MATH21', 'CSE16'],
  MATH19B: ['MATH23A', 'AM30', 'ECE30', 'CSE40', 'STAT131', 'CSE101'],
  MATH21: ['AM30'],
  MATH23A: ['CSE107'],
  CSE12: ['CSE13S'],
  CSE13S: ['CSE101', 'CSE120'],
  CSE16: ['CSE101', 'CSE107'],
  CSE20: ['CSE30', 'CSE12', 'CSE16'],
  CSE30: ['CSE40', 'CSE101'],
  CSE40: [],
  AM10: ['AM30'],
  AM30: ['CSE107'],
  ECE30: [],
  STAT131: [],
  CSE101: ['CSE101M', 'CSE102', 'CSE103', 'CSE114A', 'CSE130', 'CSE185S', 'CSE195'],
  CSE101M: [],
  CSE102: [],
  CSE103: [],
  CSE107: [],
  CSE114A: [],
  CSE115A: [],
  CSE120: [],
  CSE130: ['CSE115A'],
  CSE185S: [],
  CSE195: [],
}


type AutoObject = {
  [code in typeof codes[number]]: boolean;
};

const auto: AutoObject = codes.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as AutoObject)

const auto2: AutoObject = tcodes.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as AutoObject);

const RenderMajorCourses: React.FC = () => {
  const { studentStatus, infoData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  let options = majorLabels.map((label, index) => ({
    option: label,
    value: codes[index]
  }));


  if (studentStatus === 'T') {
    options = tmajorLabels.map((label, index) => ({
      option: label,
      value: tcodes[index]
    }));
  }

  const [autoProps, setAutoProps] = useState(studentStatus.includes('C') ? auto : auto2);

  useEffect(() => {
    const newAutoProps = studentStatus.includes('C') ? auto : auto2;
    setAutoProps({ ...newAutoProps })
  }, [studentStatus])

  // Helper function to render course prerequisites from CSAdjList
  const renderLinearFlowChart = (courses: string[]) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <Box key={course} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {course}
            </Typography>
            {index < courses.length - 1 && (
              <ArrowForwardIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', mx: 1 }} />
            )}
          </Box>
        ))
      ) : (
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          No prerequisites
        </Typography>
      )}
    </Box>
  );


  switch (infoData.major) {
    case 'CS':
      return (
        <>
          <CheckboxResponsive
            key={JSON.stringify(autoProps)}
            auto={autoProps}
            title="Major Courses"
            subtitle={!studentStatus.includes('C') ?
              `Please select all major courses that you have satisfied through transfer credit.` :
              `Please select all major courses that you have completed or have satisfied through transfer credit.
               Important:
                For the first three MATH courses ([MATH 3, MATH 19A, MATH 19B]), you only need to check one of these options.
                Selecting "MATH 19A" will automatically grant you credit for "MATH 3".
                Selecting "MATH 19B" will grant you credit for both "MATH 3" and "MATH 19A".
               `
            }
            options={options}
            state={backgroundCourseData.completedMajorCourses}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorCourses: arr }))}
          />
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
                      {`As a refresher, here are the required major courses needed for the Computer Science B.S. Major:`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Entry-Level Calculus Courses`}
                        </Typography>
                        {renderLinearFlowChart(['MATH 3 (Precalculus - Not Required)', 'MATH 19A (Calculus I)', 'MATH 19B (Calculus II)'])}
                      </Box>
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Linear Algebra`}
                        </Typography>
                        {renderLinearFlowChart(['AM 10 / MATH 21'])}
                      </Box>
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                          {`Multivariate/Vector Calculus`}
                        </Typography>
                        {renderLinearFlowChart(['AM 30 / MATH 23A'])}
                      </Box>
                    </Typography>
                  </>
                ) : (
                  <Typography>
                    { }
                  </Typography>
                )}
              </>
            }
            options={CSMajorCourses}
            addPrereq={{}}
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
  const { undergradData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  const auto: AutoObject = ucodes.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as AutoObject);

  const options = [{ option: 'AM 10 / MATH 21 (Linear Algebra)', value: 'MATH21' }];
  if (undergradData.math === '20') {
    options.push({ option: 'MATH 23A (Multivariate/Vector Calculus)', value: 'MATH23A' });
  }

  return (
    <CheckboxGroup
      auto={auto}
      title="Additional Transfer Credit for Math Courses"
      subtitle={`If you have additional math courses that you have already satisified through transfer credit, select them below. Otherwise, you may skip this section.`}
      options={options}
      state={backgroundCourseData.completedMajorCourses}
      mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorCourses: arr }))}
    />
  )
}