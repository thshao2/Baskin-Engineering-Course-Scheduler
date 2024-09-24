import { Box, Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import { useState } from "react";

interface Option {
  option: string,
  value: string,
}

interface MultipleAutocompleteProps {
  title: string,
  description: React.ReactNode
  options: Option[]
  addPrereq: { [key: string]: string[] }
  state: string[];
  mutator: (state: string[]) => void;
}



export default function MultipleAutocomplete({ title, description, options, addPrereq, state, mutator }: MultipleAutocompleteProps) {

  const selectedOptions = options.filter((option) => state.includes(option.value));

  // Recursive function to add prerequisites
  const addPrerequisites = (course: string, selectedCourses: string[]) => {
    // Check if the course has prerequisites
    if (course in addPrereq) {
      for (const prereq of addPrereq[course]) {
        if (!selectedCourses.includes(prereq)) {
          selectedCourses.push(prereq); // Add the prerequisite if not already selected
          console.log(`Automatically added prerequisite: ${prereq}`);

          // Recursively add prerequisites of the prerequisite
          addPrerequisites(prereq, selectedCourses);
        }
      }
    }
  };

  const handleMajorCoursesChange = (event: React.SyntheticEvent, value: { option: string, value: string }[]) => {
    const selectedMajorCourses = value.map((course) => course.value);

    // Find the option that was just added or removed
    const previouslySelected = state;
    const currentlySelected = selectedMajorCourses;

    const addedOption = currentlySelected.find(course => !previouslySelected.includes(course));

    if (addedOption) {
      console.log(`Added option: ${addedOption}`);
      if (addedOption in addPrereq) {
        addPrerequisites(addedOption, selectedMajorCourses);
      }
    }


    mutator(selectedMajorCourses);
  }

  console.log(`${title}: ${state}`)


  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', mt: 2 }}>
      {/* Title */}
      <Typography sx={{ fontSize: '1rem', color: '#40c4ff' }}>
        {title}
      </Typography>

      {/* Description */}
      {description}

      <Autocomplete
        multiple
        id="checkboxes-completed-major-courses"
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option.option}
        value={selectedOptions}
        onChange={handleMajorCoursesChange}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.option}
            </li>
          );
        }}
        style={{ minWidth: 300, width: '100%' }}
        renderInput={(params) => (
          <TextField {...params} label={`Add Completed ${title}...`} placeholder="Courses" />
        )}
      />
    </Box>
  );
}