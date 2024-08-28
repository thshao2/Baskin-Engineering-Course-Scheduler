import { Typography } from "@mui/material";
import { UndergradData, useFormContext } from "../../context/FormContext";
import Select from "../inputs/Select";


export default function WritingPlacement() {
  const { undergradData, setUndergradData } = useFormContext();

  return (
    <Select
      auto=""
      title="Writing Placement"
      subtitle=
      {`Select the writing course you will first be taking here at UCSC. To find out what your writing placement is, learn more about
        Directed-Self Placement or whether you have already satisfied the Entry-Level Writing Requirement.`}
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