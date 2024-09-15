import { Typography, Box } from "@mui/material"
import { getPriorityList, getInDegreeList, getDifference, CSAdjList, CS_MajorCourses } from "@/app/lib/helper"
import { generateCoursesForQuarter } from "@/app/lib/get-planners"


export default async function Test() {
  const neededMajorCourses = ['CSE20', 'MATH19B', 'CSE40', 'CSE30', 'CSE12', 'MATH23A', 'AM30', 'CSE13S', 'CSE16', 'AM10', 'MATH21', 'CSE101', 'CSE101M', 'CSE102', 'CSE103', 'CSE120', 'CSE130', 'CSE114A', 'CSE107', 'STAT131', 'ECE30', 'CSE115A', 'CSE185S', 'CSE195']
  const courses = ['CSE101', 'CSE120', 'CSE130', 'CSE114A', 'CSE115A', 'CSE144', 'CSE150', 'Major Elective']
  // const courses = ['Major Elective', 'CSE114A', 'CSE120', 'CSE115A', 'CSE144', 'CSE150', 'Major Elective', 'Major Elective', 'MATH21']
  // const courses = ['CSE 114A', 'Major Elective', 'Major Elective', 'CSE 150', 'CSE 144', 'Major Elective'];

  const temp = await getPriorityList();
  const temp2 = await getInDegreeList(neededMajorCourses);
  const temp3 = await generateCoursesForQuarter(courses, 3);
  // console.log(temp)
  return (
    <>
      <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, mt: 5, mb: 3 }}>This is only a test page.</Typography>
      <Box>
        {Object.entries(temp2)
          .sort(([, aPriority], [, bPriority]) => aPriority - bPriority) // Sort based on priority
          .map(([course, priority]) => (
            <Box key={course} mb={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">{course + ''}</Typography>
              <Typography variant="body1" sx={{ ml: 4 }}>
                In-Degree: {priority}
              </Typography>
            </Box>
          ))}
      </Box>
      {/* Second Box with the array of arrays of strings mapping */}
      <Box mt={4}>
        {temp3.map((subArray, index) => (
          <Box key={index} mb={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Typography key={index} variant="body1">
              {index + 1 + ': '}
            </Typography>
            {subArray.map((item, subIndex) => (
              <Typography key={subIndex} variant="body1">
                {item}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </>
  )
}