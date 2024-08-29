import { Typography } from "@mui/material";
import { BackgroundCourseData, useFormContext } from "../../context/FormContext";
import MultipleSelect from "../inputs/MultipleSelect";


export default function CoreCourse() {

  const {backgroundCourseData, setBackgroundCourseData} = useFormContext();

  return (
    <>
      <MultipleSelect
        auto=""
        title="College Core Course"
        subtitle={`Incoming Undergraduates will take a Core Course based on their college affiliation during their first quarter in Fall. If you don't know
          your college affiliation, choose the college that you are most likely planning on picking.`}
        options={
          [
            { option: <CoreCourseLabel name = 'Cowell College:' title ="Imagining Justice"/>, value: 'C' },
            { option: <CoreCourseLabel name = 'Stevenson College (two-quarter core course):' title ="Self and Society"/>, value: 'S' },
            { option: <CoreCourseLabel name = 'Crown College:' title ="Ethical Issues in Emerging Technologies"/>, value: 'T' },
            { option: <CoreCourseLabel name = 'Merrill College:' title ="Cultural Identities and Global Consciousness"/>, value: 'M' },
            { option: <CoreCourseLabel name = 'Porter College:' title ="Writing Across the Arts"/>, value: 'P' },
            { option: <CoreCourseLabel name = 'Kresge College:' title ="Power and Representation"/>, value: 'K' },
            { option: <CoreCourseLabel name = 'Oakes College:' title ="Communicating Diversity for a Just Society"/>, value: 'O' },
            { option: <CoreCourseLabel name = 'Rachel Carson College:' title ="Environment and Society"/>, value: 'R' },
            { option: <CoreCourseLabel name = 'College Nine:' title ="International and Global Issues"/>, value: 'N' },
            { option: <CoreCourseLabel name = 'John R. Lewis College:' title ="Social Justice and Community"/>, value: 'J' },
          ]
        }
        state={backgroundCourseData.universityReq.coreCourse}
        mutator={(value) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, universityReq: {...prev.universityReq, coreCourse: value}}))}
        />
    </>
  );

}

interface CoreCourseLabelProps {
  name: string,
  title: string,
}

const CoreCourseLabel = ({ name, title }: CoreCourseLabelProps) => {
  return (
    <>
      <Typography sx={{mt: 1}}>
        <Typography component = 'span' sx={{ fontStyle: 'bold' }}>
          {name}
        </Typography>
        <Typography component = 'span' sx={{ ml: 0.5, fontStyle: 'italic' }}>
          {title}
        </Typography>
      </Typography>
    </>
  );
};
