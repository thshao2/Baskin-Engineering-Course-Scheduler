import { Typography } from "@mui/material";
import { BackgroundCourseData, useFormContext } from "../../context/FormContext";
import MultipleSelect from "../inputs/MultipleSelect";
import CheckboxGroup from "../inputs/Checkbox";

const codes = ['CC', 'ER', 'IM', 'MF', 'SI', 'SR', 'TA', 'PE', 'PR', 'C'] as const;
type AutoObject = {
  [code in typeof codes[number]]: boolean;
};

export default function GeneralEd() {

  const { backgroundCourseData, setBackgroundCourseData } = useFormContext();
  
  
  const auto: AutoObject = codes.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as AutoObject);

  return (
    <>
      <CheckboxGroup
        auto= {auto}
        title="General Education Courses"
        subtitle={`Select General Education Requirements that you have already satisfied through transfer credit.`}
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
        state={backgroundCourseData.generalEdCourses}
        mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, generalEdCourses: arr }))}
      />
    </>
  );

}

// interface GeneralEdLabelProps {
//   title: string,
// }

// const GeneralEdLabel = ({ title }: GeneralEdLabelProps) => {
//   return (
//     <>
//       <Typography sx={{mt: 1}}>
//         {title}
//       </Typography>
//     </>
//   );
// };
