import { Typography } from "@mui/material";
import { UndergradData, useFormContext } from "../../context/FormContext";
import Select from "../inputs/Select";
import MajorCourses from "./MajorCourses";


export default function MathPlacement() {
  const {infoData, undergradData, setUndergradData} = useFormContext();

  const renderMathPlacement = () => {
    switch (infoData.major) {
      case 'CS':
        return (
          <>
            <Select
              auto=""
              title="Math Placement (Calculus)"
              subtitle={`Select the first math course you will be taking here at UCSC. To find out more about your math placement, visit here. If you have
                        transfer credit for MATH 19B or for a higher level math course, or have been placed at a math course higher than MATH 19B, select "Other".`}
              inputLabel="Course"
              options={
                [
                  { option: 'MATH 3 (Precalculus)', value: '3' },
                  { option: 'MATH 19A (Calculus 1)', value: '19A' },
                  { option: 'MATH 19B (Calculus 2)' , value: '19B' },
                  { option: 'Other', value: '20'}
                ]
              }
              state={undergradData.math}
              mutator={(value) => setUndergradData((prev: UndergradData) => ({ ...prev, math: value }))}
            />
          </>
        );
      default:
        return (
          <Typography sx={{mt: 4}}>Your major was not found. Please restart the form.</Typography>
        )

    }
  }

  return (
    <>
      {renderMathPlacement()}
    </>
  );

}