import { useFormContext } from "../../context/FormContext";


import MathPlacement from "./MathPlacement";
import WritingPlacement from "./WritingPlacement";
import Testout from "./Testout";
import CoreCourse from "./CoreCourse";
import GeneralEd from "./GeneralEd";

export default function CourseHistoryForm() {
  const { studentStatus } = useFormContext();


  return (
    <>
      {studentStatus === 'U' ? (
        <>
          <MathPlacement/>
          <WritingPlacement />
          <Testout />
          <CoreCourse />
          <GeneralEd />
        </>
      ) : (
        <div>
          Transfer/Continuing
        </div>
      )}
    </>
  )

}