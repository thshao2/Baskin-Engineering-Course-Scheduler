import { useFormContext } from "../../../context/FormContext";

import { Typography } from "@mui/material";
import CheckboxResponsive from "../../inputs/CheckboxResponsive";
import CheckboxGroup from "../../inputs/Checkbox";

import { BackgroundCourseData } from "../../../context/FormContext";
import React, { useEffect, useState } from "react";

import MajorElectives from "./MajorElectives";

const codes = [
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

const tcodes = [
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

const ucodes = [
  'MATH21', 'MATH23A'
]


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

  const [autoProps, setAutoProps] = useState(studentStatus === 'C' ? auto : auto2);

  useEffect(() => {
    const newAutoProps = studentStatus === 'C' ? auto : auto2;
    setAutoProps({ ...newAutoProps })
  }, [studentStatus])

  useEffect(() => {
    if (studentStatus === 'T') {
      const diffCodes = codes.filter(code => !tcodes.includes(code));
      setBackgroundCourseData((backgroundCourseData: BackgroundCourseData) =>
      ({
        ...backgroundCourseData, completedMajorCourses: backgroundCourseData.completedMajorCourses.filter(course => !diffCodes.includes(course))
      }));
    }
  }, [studentStatus, setBackgroundCourseData])

  switch (infoData.major) {
    case 'CS':
      return (
        <>
          <CheckboxResponsive
            key={JSON.stringify(autoProps)}
            auto={autoProps}
            title="Major Courses"
            subtitle={studentStatus !== 'C' ?
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
          {studentStatus === 'C' && <MajorElectives />}
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