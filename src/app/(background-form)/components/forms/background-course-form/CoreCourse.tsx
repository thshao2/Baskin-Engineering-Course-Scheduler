import { Typography } from "@mui/material";
import { BackgroundCourseData, useFormContext } from "../../../context/FormContext";
import MultipleSelect from "../../inputs/MultipleSelect";
import TwoSelect from "../../inputs/TwoSelect";

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

export function ContinuingCoreCourse() {
  const {backgroundCourseData, setBackgroundCourseData} = useFormContext();

  return (
    <TwoSelect
        title = "Have you completed your College Core Course?"
        subtitle = {`For most continuing students, you have already completed your core course. 
          This option is for undergraduates affiliated with Stevenson (with a two-quarter core course) who are planning for their second quarter at UCSC.
          Transfer students are waived from this requirement.`}
        options = {
          [
            { option: "No. I am taking a two-quarter core course and will be taking the second part next quarter.", value: '2'},
            { option: "Yes, I have completed my college core course, or I am a transfer student.", value: '1'},
          ]
        }
        state = {backgroundCourseData.universityReq.coreCourse}
        mutator={(value: string) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, universityReq: {...prev.universityReq, coreCourse: value}}))}
      />
  )
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
