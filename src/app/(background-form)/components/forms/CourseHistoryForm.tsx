import { useFormContext } from "../../context/FormContext";


import MathPlacement from "./MathPlacement";
import WritingPlacement from "./WritingPlacement";
import Testout from "./Testout";
import CoreCourse from "./CoreCourse";
import GeneralEd from "./GeneralEd";
import MajorCourses from "./MajorCourses";
import { ContinuingCoreCourse } from "./CoreCourse";
import { UndergradMathTransfer } from "./MajorCourses"


export default function CourseHistoryForm() {
  const { studentStatus } = useFormContext();


  return (
    <>
      {studentStatus === 'U' ? (
        <>
          <MathPlacement />
          <UndergradMathTransfer />
          <Testout />
          <CoreCourse />
          <GeneralEd />
        </>
      ) : (
        <>
          {studentStatus === 'C' && <ContinuingCoreCourse/>}
          <GeneralEd />
          <MajorCourses />
        </>
      )}
    </>
  )

}