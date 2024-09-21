import { Typography } from "@mui/material";
import { UndergradData, useFormContext } from "../../../context/FormContext";
import Select from "../../inputs/Select";
import SubtitleLink from "../../inputs/SubtitleLink"
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function WritingPlacement() {
  const { studentStatus, undergradData, setUndergradData } = useFormContext();

  return (
    <Select
      auto=""
      title="Writing Placement"
      // subtitle=
      // {studentStatus === 'U' ? `Select the writing course you will first be taking here at UCSC. To find out what your writing placement is, learn more about
      //   Directed-Self Placement or whether you have already satisfied the Entry-Level Writing Requirement. If you already have credit for the Writing Requirement (satisfying Writing 2), 
      //   you may leave this blank and select the "Composition" checkbox in the "General Education Courses" section above to indicate that you have already completed this requirement.` : 
      //   `If you have already completed the Writing General Education Requirement or have transfer credit for it, 
      //   select the "Composition" checkbox in the "General Education Courses" section to indicate that you have already completed this requirement. 
      //   Otherwise, select the next writing course you will be taking here at UCSC.`}
      subtitle={
        <>
          {studentStatus === 'U' ? (
            <Typography
              sx={{ mt: 1, fontSize: 14, mb: 2 }}>
              {`Select the writing course you plan to take first at UCSC. To determine your writing placement, 
                review and learn more about `}
              <SubtitleLink
                href="https://writing.ucsc.edu/undergraduate/writing-requirements-placement/"
                icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
              >
                Writing Course Requirements at UCSC and Directed-Self Placement
              </SubtitleLink>
              {`, and check if you have already met the `}
              <SubtitleLink
                href="https://writingplacement.sites.ucsc.edu/elwr-info/"
                icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
              >
                Entry-Level Writing Requirement (ELWR)
              </SubtitleLink>.
              {` Information on satisfying the Entry-Level Writing Requirement can also be found in the `}
              <SubtitleLink
                href="https://catalog.ucsc.edu/en/current/general-catalog/undergraduate-information/undergraduate-academic-program/university-requirements/entry-level-writing-requirement/"
                icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
              >
                General Catalog
              </SubtitleLink>.
              {`If you have credit for the Writing Requirement (equivalent to Writing 2), 
               you may leave this blank and check the "Composition" box in the "General Education Courses" 
               section above to indicate completion of writing requirements.`}
            </Typography>
          ) : (
            <Typography
              sx={{ mt: 1, fontSize: 14, mb: 2 }}>
              {`If you have already completed the Writing Requirement (Writing 2), or have transfer credit equivalent 
              to Writing 2, check the "Composition" box in the "General Education Courses" section to indicate completion 
              of writing requirements. Otherwise, select the next writing course you plan to take at UCSC. `}
              {`You can learn more about Writing Course Requirements at UCSC `}
              <SubtitleLink
                href="https://writing.ucsc.edu/undergraduate/writing-requirements-placement/"
                icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
              >
                here
              </SubtitleLink>.
            </Typography>
          )}
        </>
      }
      inputLabel="Course"
      options={
        [
          { option: 'Writing 1 / Writing 1E (Entry-Level Writing Requirement)', value: '1' },
          { option: 'Writing 2 / Writing 2H (Composition General Education Requirement)', value: '2' },
          { option: 'Writing 25 (designed for new English-language learners)', value: '25' },
          { option: 'Writing 26 (designed for new English-language learners)', value: '26' },
        ]
      }
      state={undergradData.writing}
      mutator={(value) => setUndergradData((prev: UndergradData) => ({ ...prev, writing: value }))}
    />
  );

}