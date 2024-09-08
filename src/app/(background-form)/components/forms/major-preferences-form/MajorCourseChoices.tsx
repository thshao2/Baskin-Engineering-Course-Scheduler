import { useFormContext } from "@/app/(background-form)/context/FormContext";
import Typography from "@mui/material/Typography";
import MultipleSelect from "../../inputs/MultipleSelect";



const RenderMajorCourseChoices: React.FC = () => {

  const { infoData, backgroundCourseData, majorChoices, setMajorChoices } = useFormContext();

  switch (infoData.major) {
    case 'CS':
      return (
        <>
          {
            (!backgroundCourseData.completedMajorCourses.includes('AM10')
              && !backgroundCourseData.completedGeneralEdCourses.includes('MATH21')) &&
            <MultipleSelect
              auto=""
              title="Course Preference (Linear Algebra): AM 10 or MATH 21"
              subtitle="Choose one of the following:"
              options={[
                { option: 'AM 10: Mathematical Methods for Engineers I (Recommended)', value: 'AM10' },
                { option: 'MATH 21: Linear Algebra', value: 'MATH21' },
                { option: 'I am unsure so far and I am open to taking any of these courses.', value: 'BOTH2' }
              ]}
              state={majorChoices[0]}
              mutator={(value: string) =>
                setMajorChoices((prev: string[]) => {
                  const updatedChoices = [...prev];
                  updatedChoices[0] = value; // Update the value at index 0
                  return updatedChoices;
                })
              }
            />
          }
          {
            (!backgroundCourseData.completedMajorCourses.includes('AM30')
              && !backgroundCourseData.completedGeneralEdCourses.includes('MATH23A')) &&
            <MultipleSelect
              auto=""
              title="Course Preference (Multivariate Calculus): AM 30 or MATH 23A"
              subtitle="Choose one of the following:"
              options={[
                { option: 'AM 30: Multivariate Calculus for Engineers', value: 'AM30' },
                { option: 'MATH 23A: Vector Calculus', value: 'MATH23A' },
                { option: 'I am unsure so far and I am open to taking any of these courses.', value: 'BOTH2' }
              ]}
              state={majorChoices[1]}
              mutator={(value: string) =>
                setMajorChoices((prev: string[]) => {
                  const updatedChoices = [...prev];
                  updatedChoices[1] = value; // Update the value at index 1
                  return updatedChoices;
                })
              }
            />
          }
          {
            (!backgroundCourseData.completedMajorCourses.includes('CSE102')
              && !backgroundCourseData.completedGeneralEdCourses.includes('CSE103')
              && parseInt(infoData.catalogYear, 10) >= 24) &&
            <MultipleSelect
              auto=""
              title="Course Preference: CSE 102 or CSE 103"
              subtitle="Choose one of the following:"
              options={[
                { option: 'CSE 102: Introduction to Analysis of Algorithms', value: 'CSE102' },
                { option: 'CSE 103: Computational Models', value: 'CSE103' },
                { option: 'I am unsure so far and I am open to taking any of these courses.', value: 'BOTH2' }
              ]}
              state={majorChoices[2]}
              mutator={(value: string) =>
                setMajorChoices((prev: string[]) => {
                  const updatedChoices = [...prev];
                  updatedChoices[2] = value; // Update the value at index 2
                  return updatedChoices;
                })
              }
            />
          }
          {
            (!backgroundCourseData.completedMajorCourses.includes('STAT131')
              && !backgroundCourseData.completedGeneralEdCourses.includes('CSE107')) &&
            <MultipleSelect
              auto=""
              title="Course Preference (Statistics): STAT131 or CSE107"
              subtitle="Choose one of the following:"
              options={[
                { option: 'CSE 107: Probability and Statistics for Engineers', value: 'CSE107' },
                { option: 'STAT 131: Introduction to Probability Theory', value: 'STAT131' },
                { option: 'I am unsure so far and I am open to taking any of these courses.', value: 'BOTH2' }
              ]}
              state={majorChoices[3]}
              mutator={(value: string) =>
                setMajorChoices((prev: string[]) => {
                  const updatedChoices = [...prev];
                  updatedChoices[3] = value; // Update the value at index 1
                  return updatedChoices;
                })
              }
            />
          }
          {
            (!backgroundCourseData.completedMajorCourses.includes('CSE115A')
              && !backgroundCourseData.completedGeneralEdCourses.includes('CSE185S') 
              && !backgroundCourseData.completedGeneralEdCourses.includes('CSE195')) &&
            <MultipleSelect
              auto=""
              title="DC Preference: CSE115A, CSE185S, or CSE 195"
              subtitle="Choose one of the following:"
              options={[
                { option: 'CSE 115A: Introduction to Software Engineering', value: 'CSE115A' },
                { option: 'CSE 185S: Technical Writing for Computer Science and Engineering', value: 'CSE185S' },
                { option: 'CSE 195: Senior Thesis', value: 'CSE195' },
                { option: 'I am unsure so far and I am open to taking any of these courses.', value: 'ALL3' }
              ]}
              state={majorChoices[4]}
              mutator={(value: string) =>
                setMajorChoices((prev: string[]) => {
                  const updatedChoices = [...prev];
                  updatedChoices[4] = value; // Update the value at index 1
                  return updatedChoices;
                })
              }
            />
          }
        </>
      );
    default:
      return (
        <Typography sx={{ mt: 4 }}>Your major was not found. Please restart the form.</Typography>
      )

  }
}

export default function MajorCourseChoices() {
  return (
    <>
      <RenderMajorCourseChoices />
    </>
  )
}