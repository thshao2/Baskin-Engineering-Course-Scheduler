import {Box, TableContainer, Table, Paper, TableHead, TableRow, TableBody, TableCell, Skeleton} from '@mui/material'

import { red, orange, blue, green, cyan, teal, pink, purple } from '@mui/material/colors'

export const CSFormat: Record<string, string> = {
  MATH3: 'MATH 3: Precalculus',
  MATH19A: 'MATH 19A: Calculus I',
  MATH19B: 'MATH 19B: Calculus II',
  MATH21: 'MATH 21: Linear Algebra',
  MATH23A: 'MATH 23A: Vector Calculus',
  CSE12: 'CSE 12: Comp Sys/Assembly Lang',
  CSE13S: 'CSE 13S: Comp Sys and C Prog',
  CSE16: 'CSE 16: Appl Discrete Math',
  CSE20: 'CSE 20: Beginning Python',
  CSE30: 'CSE 30: Prog Abs Python',
  CSE40: 'CSE 40: ML Basics',
  AM10: 'AM 10: Math Methods I',
  AM30: 'AM 30: SOE Calculus III',
  ECE30: 'ECE 30: Engr Prin of Elec',
  STAT131: 'STAT 131: Intro Prob Theory',
  CSE101: 'CSE 101: Data Structs & Algs',
  CSE101M: 'CSE 101M: Math Thinking CS',
  CSE102: 'CSE 102: Algorithm Analysis',
  CSE103: 'CSE 103: Computational Models',
  CSE107: 'CSE 107: Probability/Stats',
  CSE114A: 'CSE 114A: Found of Program Lang',
  CSE115A: 'CSE 115A: Intro Software Eng',
  CSE120: 'CSE 120: Computer Architecture',
  CSE130: 'CSE 130: Prin Computer Sys Dsgn',
  CSE185S: 'CSE 185S: Tech Writ Comp Engs',
  CSE195: 'CSE 195: Senior Thesis Research'
};

const format = (course: string) => {
  return CSFormat[course] ? CSFormat[course] : course;
}

const getColor = (course: string) => {
  if (CSFormat[course] !== undefined) {
    return blue[500];
  }
  if (course === 'GE Course') {
    return green[400];
  }
  if (course === 'Elective') {
    return cyan[500];
  }
  if (course === 'Major Elective') {
    return purple['A100'];
  }
  if (course === 'Capstone Elective') {
    return teal['A700'];
  }
  if (course.startsWith('Writing')) {
    return red['A200']
  }
  if (course.startsWith('College Core')) {
    return pink['A200']
  }
  return 'white';
}

export const QuarterSkeleton = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={1}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  // borderBottom: '1px solid white',
                  padding: '1rem'
                }}
              >
                {/* Skeleton for the Quarter Title */}
                <Skeleton variant="text" width="60%" height={32} sx={{ margin: '0 auto' }} />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Loop to create Skeleton rows for each course */}
            {[...Array(4)].map((_, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    textAlign: 'center',
                    // borderBottom: '1px solid white',
                    padding: '0.5rem'
                  }}
                >
                  {/* Skeleton for course rows */}
                  <Skeleton variant="rectangular" width="80%" height={20} sx={{ margin: '0 auto' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default function Quarter({ quarter, courses }: { quarter: string, courses: string[] }) {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Table Structure */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', border: '1px solid #78909c' }}>
        <Table aria-label="quarter schedule">

          {/* Table Head for Quarter Title */}
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={1}  // Span the entire row with the title
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' },  // Responsive font size
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight background for the header
                  color: orange['A400'],
                  // borderBottom: '1px solid white',
                  padding: '1rem'
                }}
              >
                {quarter}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body for Courses */}
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    textAlign: 'center',
                    // borderBottom: '1px solid white',
                    color: getColor(course),  // Assuming a dark background
                    padding: '0.5rem'
                  }}
                >
                  {format(course)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};