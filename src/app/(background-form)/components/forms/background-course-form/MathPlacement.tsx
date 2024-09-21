import { Typography } from "@mui/material";
import { UndergradData, useFormContext } from "../../../context/FormContext";
import Select from "../../inputs/Select";

import SubtitleLink from "../../inputs/SubtitleLink";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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
              subtitle = {
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
                  { option: 'MATH 3 (Precalculus)', value: '3' },
                  { option: 'MATH 19A (Calculus I)', value: '19A' },
                  { option: 'MATH 19B (Calculus II)' , value: '19B' },
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