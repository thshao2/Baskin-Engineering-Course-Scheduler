// import { useState } from "react";

// import Box from '@mui/material/Box';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import { SelectChangeEvent } from '@mui/material/Select';
// import { Typography } from '@mui/material';

// import TextField from '@mui/material/TextField';
// import Switch from '@mui/material/Switch';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { useFormContext } from "../../../context/FormContext";

// import Grid from '@mui/material/Grid2'
// import { getEnrolledQuarters } from "../student-preferences-form/NumCoursesPreference";


// export default function NumMajorCoursesPreference() {
//   const { infoData, numCoursesPreference, setNumCoursesPreference } = useFormContext();

//   const [defaultNumMajorCourses, setDefaultNumMajorCourses] = useState(numCoursesPreference.numMajorCourses.length === 1 ? numCoursesPreference.numMajorCourses[0] : '2');

//   const enrolledQuarters = getEnrolledQuarters(infoData.gradDate, infoData.startPlanner, infoData.planner).slice(0, 3);

//   const numCoursesPerQuarter = numCoursesPreference.numCoursesPerQuarter;
//   let allowedDefaultOptions: string[] = [];
//   let allowedAdvancedOptions: string[][] = [];

//   if (numCoursesPerQuarter.length === 1) {
//     const num = parseInt(numCoursesPerQuarter[0], 10);
//     const temp = [];
//     for (let i = 1; i <= num; i++) {
//       temp.push(i.toString());
//     }
//     allowedDefaultOptions = temp;
//     allowedAdvancedOptions.push(...Array(3).fill(temp)); // Fills array with three temp arrays
//   } else {
//     const newArr = numCoursesPerQuarter.map(Number);
//     const min = Math.min(...newArr);
//     for (let i = 1; i <= min; i++) {
//       allowedDefaultOptions.push(i.toString());
//     }
//     for (let i = 0; i <= 2; i++) {
//       const num = newArr[i];
//       const temp = [];
//       for (let i = 1; i <= num; i++) {
//         temp.push(i.toString());
//       }
//       allowedAdvancedOptions.push(temp);
//     }
//   }

//   const [advancedMode, setAdvancedMode] = useState<boolean>(numCoursesPreference.numMajorCourses.length === 3);
//   const [advancedNumMajorCourses, setAdvancedNumMajorCourses] = useState(
//     numCoursesPreference.numMajorCourses.length === 3 ?
//       numCoursesPreference.numMajorCourses :
//       Array(3).fill(defaultNumMajorCourses, 0))

//   const handleDefaultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value as string;
//     setDefaultNumMajorCourses(value);
//     setNumCoursesPreference((prev) => ({
//       ...prev,
//       numMajorCourses: [value],
//     }));
//   };

//   const handleAdvancedToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setAdvancedMode((prev) => !prev);
//     if (event.target.checked) {
//       const newNumMajorCourses = Array(3).fill(defaultNumMajorCourses, 0);
//       setNumCoursesPreference((prev) => ({
//         ...prev,
//         numMajorCourses: newNumMajorCourses,
//       }));
//       setAdvancedNumMajorCourses(newNumMajorCourses);
//     } else {
//       setNumCoursesPreference((prev) => ({
//         ...prev,
//         numMajorCourses: [defaultNumMajorCourses],
//       }));
//     }

//   };

//   const handleAdvancedCourseChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     const updatedCourses = [...advancedNumMajorCourses];
//     updatedCourses[index] = event.target.value as string;
//     setAdvancedNumMajorCourses(updatedCourses);
//     setNumCoursesPreference((prev) => ({
//       ...prev,
//       numMajorCourses: updatedCourses,
//     }));
//   };

//   console.log(numCoursesPreference.numMajorCourses)


//   return (
//     <Box sx={{ width: '100%' }}>
//       <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold', fontSize: 18 }}>
//         Preferred Number of Major Courses Per Quarter
//       </Typography>
//       <Typography sx={{ mb: 2, fontSize: 14 }}>
//         {`The suggested Baskin Engineering course load is 2 major classes per quarter (default). However, you may override this setting by choosing a different
//             option or by selecting the "Advanced" tab to indiciate the number of major classes you want to take for specific quarters (optional).`}
//       </Typography>
//       <Box sx={{ mb: 2 }}>
//         <FormControlLabel control={
//           <Switch
//             checked={advancedMode}
//             onChange={handleAdvancedToggle}
//             inputProps={{ 'aria-label': 'controlled' }}
//           />
//         } label="Advanced Options" />
//       </Box>
//       {advancedMode ? (
//         <Grid
//           container
//           spacing={0.5}
//         >
//           {enrolledQuarters.map((opt, index) => (
//             <Grid
//               size={{ xs: 6, sm: 4, md: 3, lg: 3 }}
//               key={opt.value}
//               sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//             >
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography sx={{ mb: 1, fontSize: 14 }}>
//                   {opt.option}
//                 </Typography>
//                 <FormControl>
//                   <TextField
//                     id={`number-major-courses-${opt.value}`}
//                     select
//                     value={advancedNumMajorCourses[index]}
//                     onChange={handleAdvancedCourseChange(index)}
//                     sx={{ mb: 2, width: 80 }}
//                   >
//                     {allowedAdvancedOptions[index].map((num) => (
//                       <MenuItem key={num} value={num}>{num}</MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <FormControl sx={{ minWidth: 80 }}>
//           <TextField
//             id="number-major-courses-per-quarter"
//             select
//             value={defaultNumMajorCourses}
//             onChange={handleDefaultChange}
//           >
//             {allowedDefaultOptions.map((opt) => (
//               <MenuItem key={opt} value={opt}>{opt}</MenuItem>
//             ))}
//           </TextField>
//         </FormControl>
//       )}
//     </Box>

//   );
// };

