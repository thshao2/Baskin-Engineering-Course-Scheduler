import { BackgroundCourseData, useFormContext } from "../../../context/FormContext";
import TwoSelect from "../../inputs/TwoSelect";
import CheckboxGroup from "../../inputs/Checkbox";
import WritingPlacement from "./WritingPlacement";

import SubtitleLink from "../../inputs/SubtitleLink";
import { Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function GeneralEd() {

  const { studentStatus, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  return (
    <>
      <TwoSelect
        title="Have you satisfied the AHR (American History and Institutions) University Requirement?"
        subtitle={
          <>
            <Typography variant='subtitle2'
              sx={{ mt: 0.5 }}>
              {`Details for whether you have satisfied the AHR University Requirement can be found `}
              <SubtitleLink
                href="https://catalog.ucsc.edu/en/current/general-catalog/undergraduate-information/undergraduate-academic-program/university-requirements/"
                icon={<OpenInNewIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />} // Pass the icon here
              >
                here
              </SubtitleLink>.
            </Typography>
          </>
        }
        options={
          [
            { option: "Yes, I have satisfied the AHR University Requirement.", value: 'T' },
            { option: "No, I have not satisfied the AHR University Requirement.", value: 'F' },
          ]
        }
        state={backgroundCourseData.ahr}
        mutator={(value: string) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, ahr: value }))}
      />
      <CheckboxGroup
        title="General Education Courses"
        subtitle={!studentStatus.includes('C') ?
          `Select General Education Requirements that you have satisfied through transfer credit.` :
          `Select General Education Requirements that you have satisified through coursework or through transfer credit.`
        }
        options={
          [
            { option: "CC (Cross-Cultural Anaylsis)", value: 'CC' },
            { option: "ER (Ethnicity and Race)", value: 'ER' },
            { option: "IM (Interpreting Arts and Media)", value: 'IM' },
            { option: "MF (Mathematical and Formal Reasoning)", value: 'MF' },
            { option: "SI (Scientific Inquiry)", value: 'SI' },
            { option: "SR (Statistical Reasoning)", value: 'SR' },
            { option: "TA (Texual Analysis)", value: 'TA' },
            { option: "PE-E, PE-H, or PE-T (Environmental Awareness, Human Behavior, or Technology and Society)", value: 'PE' },
            { option: "PR-E, PR-C, PR-S (Collaborative Endeavor, Creative Process, or Service Learning)", value: 'PR' },
            { option: "C (Composition)", value: 'C' },
          ]
        }
        state={backgroundCourseData.completedGeneralEdCourses}
        mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedGeneralEdCourses: arr }))}
      />
      {!backgroundCourseData.completedGeneralEdCourses.includes('C') &&
        <WritingPlacement />
      }
    </>
  );
}
