import { Typography } from "@mui/material";
import { UndergradData, useFormContext } from "../../context/FormContext";
import Select from "../inputs/Select";


export default function MathPlacement() {
  const {infoData, undergradData, setUndergradData} = useFormContext();

  const renderMathPlacement = () => {
    switch (infoData.major) {
      case 'CS':
        return (
          <Select
            auto=""
            title="Math Placement"
            subtitle="Select the math course you will first be taking here at UCSC. To find out more about your math placement, visit here."
            inputLabel="Course"
            options={
              [
                { option: 'MATH 3', value: '3' },
                { option: 'MATH 19A', value: '19A' },
                { option: 'MATH 19B', value: '19B' },
                { option :'MATH 23A', value: '23A'},
              ]
            }
            state={undergradData.math}
            mutator={(value) => setUndergradData((prev: UndergradData) => ({ ...prev, math: value }))}
          />
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