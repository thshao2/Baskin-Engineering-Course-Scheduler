import { BackgroundCourseData, useFormContext, UndergradData } from "../../../context/FormContext";
import TwoSelect from "../../inputs/TwoSelect";
import CheckboxGroup from "../../inputs/Checkbox";
import WritingPlacement from "./WritingPlacement";

const codes = ['CC', 'ER', 'IM', 'MF', 'SI', 'SR', 'TA', 'PE', 'PR', 'C'] as const;
type AutoObject = {
  [code in typeof codes[number]]: boolean;
};

export default function GeneralEd() {

  const { studentStatus, backgroundCourseData, setBackgroundCourseData } = useFormContext();
  
  
  const auto: AutoObject = codes.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as AutoObject);

  return (
    <>
      <CheckboxGroup
        auto= {auto}
        title="General Education Courses"
        subtitle={studentStatus !== 'C' ? 
          `Select General Education Requirements that you have satisfied through transfer credit.` :
          `Select General Education Courses that you have already taken, or have received transfer credit for.`
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
        <WritingPlacement/>
      }
      <TwoSelect
        title = "Have you satisfied the AHR (American History and Institutions) University Requirement?"
        subtitle = "Details for whether you have satisfied the AHR Requirement can be found here."
        options = {
          [
            { option: "Yes, I have satisfied the AHR University Requirement.", value: 'T'},
            { option: "No, I have not satisfied the AHR University Requirement.", value: 'F'},
          ]
        }
        state = {backgroundCourseData.universityReq.ahr}
        mutator={(value: string) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, universityReq: {...prev.universityReq, ahr: value}}))}
      />
    </>
  );

}
