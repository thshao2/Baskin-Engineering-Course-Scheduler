import { useFormContext } from "../../context/FormContext";

import { Typography } from "@mui/material";
import CheckboxResponsive from "../inputs/CheckboxResponsive";

import { BackgroundCourseData } from "../../context/FormContext";
import React from "react";

const codes = [
  'MATH3', 'MATH19A', 'MATH19B', 'MATH21', 'MATH23A',
  'CSE20', 'CSE30', 'CSE40', 'CSE12', 'CSE13S', 'CSE16',
  'AM10', 'AM30', 'STAT131', 'ECE30',
  'CSE101', 'CSE101M', 'CSE102', 'CSE103', 'CSE107', 'CSE114A', 'CSE115A', 'CSE120', 'CSE130', 'CSE185S',
  ] as const;

const majorLabels = [
  'MATH 3', 'MATH 19A', 'MATH 19B', 'MATH 21', 'MATH 23A',
  'CSE 20', 'CSE 30', 'CSE 40', 'CSE 12', 'CSE 13S', 'CSE 16',
  'AM 10', 'AM 30', 'STAT 131', 'ECE 30',
  'CSE 101', 'CSE 101M', 'CSE 102', 'CSE 103', 'CSE 107', 'CSE 114A', 'CSE 115A', 'CSE 120', 'CSE 130', 'CSE 185S',
  ] as const;

  const tcodes = [
    'MATH3', 'MATH19A', 'MATH19B', 'MATH21', 'MATH23A',
    'CSE20', 'CSE30', 'CSE40', 'CSE12', 'CSE13S', 'CSE16',
    'AM10', 'AM30', 'STAT131', 'ECE30', 'CSE101', 'CSE107'
    ] as const;
  
  const tmajorLabels = [
    'MATH 3', 'MATH 19A', 'MATH 19B', 'MATH 21', 'MATH 23A',
    'CSE 20', 'CSE 30', 'CSE 40', 'CSE 12', 'CSE 13S', 'CSE 16',
    'AM 10', 'AM 30', 'STAT 131', 'ECE 30', 'CSE 101', 'CSE 107'
    ] as const;

type AutoObject = {
  [code in typeof codes[number]]: boolean;
};

const renderMajorCourses = () => {
  const { studentStatus, infoData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  React.useEffect(() => {
    if (studentStatus === 'T') {
      setBackgroundCourseData({...backgroundCourseData, completedMajorCourses: []})
    }
  }, [])

  const auto: AutoObject = codes.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as AutoObject);

  let options;

  if (studentStatus === 'T') {
    options = tmajorLabels.map((label, index) => ({
      option: label,
      value: tcodes[index]
    }));
  } else {
    options = majorLabels.map((label, index) => ({
      option: label,
      value: codes[index]
    }));
  }


  switch (infoData.major) {
    case 'CS':
      return (
        <CheckboxResponsive
          auto = {auto}
          title = "Major Courses"
          subtitle={studentStatus !== 'C' ? 
            `Select Required Major Courses that you have already satisfied through transfer credit.` :
            `Select Required Major Courses that you have already taken, or have already received credit for.`
          }
          options = {options}
          state={backgroundCourseData.completedMajorCourses}
          mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorCourses: arr }))}
        />
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
      {renderMajorCourses()}
    </>
  )
}