import { Typography } from "@mui/material";
import { BackgroundCourseData, useFormContext } from "../../../context/FormContext";
import Select from "../../inputs/Select";

import SubtitleLink from "../../inputs/SubtitleLink";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function MathPlacement() {
  const { infoData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  // Function to determine the state for the Select component
  const getMathPlacementState = () => {
    const mathCourses = ['MATH1', 'MATH3', 'MATH19A', 'MATH19B', 'MATH23A'];
    
    // Find the first match in completedMajorCourses
    let foundCourse = backgroundCourseData.completedMajorCourses.find(course => 
      mathCourses.includes(course)
    );

    if (foundCourse && foundCourse === 'MATH23A') {
      foundCourse = 'MATH19B';
    }

    // If a match is found, return it; otherwise, return an empty string
    return foundCourse || '';
  };

  const handleMathPlacementChange = (value: string) => {
    setBackgroundCourseData((prev: BackgroundCourseData) => {
      // Filter out the existing values (MATH3, MATH 19A, MATH 19B, MATH23A)
      const filteredCourses = prev.completedMajorCourses.filter(
        course => !['MATH1', 'MATH3', 'MATH19A', 'MATH19B', 'MATH23A'].includes(course)
      );

      // Add the new value to the filtered list
      const updatedCourses = [...filteredCourses, value];


      // Return the updated backgroundCourseData state
      return {
        ...prev,
        completedMajorCourses: updatedCourses,
      };
    });
  };

  const renderMathPlacement = () => {
    switch (infoData.major) {
      case 'CS':
        return (
          <>
            <Select
              auto=""
              title="Math Placement (Calculus)"
              subtitle={
                <>
                  <Typography
                    sx={{ mt: 1, fontSize: 14, mb: 2 }}>
                    {`Select the first math course you will be taking here at UCSC. To find out more about your math placement, visit `}
                    <SubtitleLink
                      href="https://mathplacement.ucsc.edu/"
                      icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
                    >
                      here
                    </SubtitleLink>
                    {`. If you have transfer credit for MATH 19B (Calculus II) or for a higher level math course, 
                    or have been placed at a math course higher than MATH 19B, you may select "Other".`}
                  </Typography>
                </>
              }
              inputLabel="Course"
              options={
                [
                  { option: 'MATH 3 (Precalculus)', value: 'MATH1' },
                  { option: 'MATH 19A (Calculus I)', value: 'MATH3' },
                  { option: 'MATH 19B (Calculus II)', value: 'MATH19A' },
                  { option: 'Other', value: 'MATH19B' }
                ]
              }
              state={getMathPlacementState()}
              mutator={handleMathPlacementChange}
            />
          </>
        );
      default:
        return (
          <Typography sx={{ mt: 4 }}>Your major was not found. Please restart the form.</Typography>
        )

    }
  }

  return (
    <>
      {renderMathPlacement()}
    </>
  );
}