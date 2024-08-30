import { Typography } from "@mui/material";
import { UndergradData, useFormContext } from "../../context/FormContext";
import Select from "../inputs/Select";


export default function WritingPlacement() {
  const { studentStatus, undergradData, setUndergradData } = useFormContext();

  return (
    <Select
      auto=""
      title="Writing Placement"
      subtitle=
      {studentStatus === 'U' ? `Select the writing course you will first be taking here at UCSC. To find out what your writing placement is, learn more about
        Directed-Self Placement or whether you have already satisfied the Entry-Level Writing Requirement. If you already have credit for the Writing Requirement (satisfying Writing 2), 
        you may leave this blank and select the "Composition" checkbox in the "General Education Courses" section above to indicate that you have already completed this requirement.` : 
        `If you have already completed the Writing General Education Requirement or have transfer credit for it, 
        select the "Composition" checkbox in the "General Education Courses" section to indicate that you have already completed this requirement. 
        Otherwise, select the next writing course you will be taking here at UCSC.`}
      inputLabel="Course"
      options={
        [
          {option: 'Writing 1 / Writing 1E (Entry-Level Writing Requirement)' , value: '1'},
          {option: 'Writing 2 / Writing 2H (Composition General Education Requirement)' , value: '2'},
          {option: 'Writing 25 (designed for new English-language learners)' , value: '25'},
          {option: 'Writing 26 (designed for new English-language learners)' , value: '26'},
        ]
      }
      state={undergradData.writing}
      mutator={(value) => setUndergradData((prev: UndergradData) => ({ ...prev, writing: value }))}
    />
  );

}