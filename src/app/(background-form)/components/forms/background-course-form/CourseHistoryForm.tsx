import { useFormContext } from "../../../context/FormContext";

import MathPlacement from "./MathPlacement";
import Testout from "./Testout";
import GeneralEd from "./GeneralEd";
import MajorCourses from "./MajorCourses";
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
          <GeneralEd />
        </>
      ) : (
        <>
          <GeneralEd />
          <MajorCourses />
        </>
      )}
    </>
  )

}