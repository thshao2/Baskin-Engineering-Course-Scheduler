
import { Box, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { orange, blue, pink, red, green, purple, cyan, teal } from '@mui/material/colors';
import { DisplayElement } from '@/app/lib/get-planners';

export const DisplayCSFormat: Record<string, string> = {
  MATH3: 'MATH 3',
  MATH19A: 'MATH 19A',
  MATH19B: 'MATH 19B',
  MATH21: 'MATH 21',
  MATH23A: 'MATH 23A',
  CSE12: 'CSE 12',
  CSE13S: 'CSE 13S',
  CSE16: 'CSE 16',
  CSE20: 'CSE 20',
  CSE30: 'CSE 30',
  CSE40: 'CSE 40',
  AM10: 'AM 10',
  AM30: 'AM 30',
  ECE30: 'ECE 30',
  STAT131: 'STAT 131',
  CSE101: 'CSE 101',
  CSE101M: 'CSE 101M',
  CSE102: 'CSE 102',
  CSE103: 'CSE 103',
  CSE107: 'CSE 107',
  CSE114A: 'CSE 114A',
  CSE115A: 'CSE 115A',
  CSE120: 'CSE 120',
  CSE130: 'CSE 130',
  CSE185S: 'CSE 185S',
  CSE195: 'CSE 195',
};

const format = (course: string) => {
  return DisplayCSFormat[course] ? DisplayCSFormat[course] : course;
}

export function PlannerInfoDisplaySkeleton() {
  return (
    <>
      <Box sx={{ width: '100%', mt: 4, padding: 2, border: '1px solid #78909c' }}>
        <Typography sx={{ mb: 2 }} variant="h5" color={orange[500]} gutterBottom fontWeight='bold'>
          Planner Information
        </Typography>
        {/* Data Skeleton */}
        <Grid container spacing={2}>
          {[...Array(8)].map((_, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 0.85 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ width: '100%', mb: 4, padding: 2, border: '1px solid #78909c' }}>
        <Typography sx={{ mb: 2 }} variant="h5" color={cyan[600]} gutterBottom fontWeight='bold'>
          Key
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`GE Course:`}
              value={`Choose a GE course from one of your unsatisfied GE Requirements.`}
              color1={green[400]}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Major Course:`}
              value={`Required Core Major Courses.`}
              color1={blue[500]}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Major Elective:`}
              value={`Choose a Major Elective from the valid electives list from your major, 
                while adhering to major elective constraints/requirements (shown in Planner Information).`}
              color1={purple['A100']}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Capstone Elective:`}
              value={`Choose a Capstone Elective from the valid capstone electives list from your major.`}
              color1={teal['A700']}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Elective:`}
              value={`This course is entirely at your discretion. 
                You can use it to fulfill university requirements, pursue courses for your minor, 
                or explore any other subjects of interest. 
                Electives provide flexibility to tailor your education 
                to your personal and academic goals.`}
              color1={cyan[500]}
              color2="textPrimary" />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default function PlannerInfoDisplay({ displayInfo }: { displayInfo: DisplayElement }) {
  const formatAllowedMajorCourses = [];
  const formatLockedMajorCourses = [];
  for (const course of displayInfo.allowedMajorCourses) {
    if (course.includes('Elective')) {
      break;
    }
    formatAllowedMajorCourses.push(format(course));
  }

  for (const course of displayInfo.lockedMajorCourses) {
    formatLockedMajorCourses.push(format(course));
  }

  const formatMajorElectives = [];

  let hasCapstone = displayInfo.electives.capstone as boolean;

  if (!displayInfo.electives.elective2) {
    formatMajorElectives.push(hasCapstone ? 'Non-AM/STAT/MATH/PHYS Major Elective' : 'Capstone Elective');
    hasCapstone = true;
  }
  if (!displayInfo.electives.elective1) {
    formatMajorElectives.push(hasCapstone ? 'CSE Major Elective' : 'CSE Capstone Elective');
    hasCapstone = true;
  }
  if (!hasCapstone) {
    formatMajorElectives.push('Capstone Elective');
  }
  if (!displayInfo.electives.elective3) {
    formatMajorElectives.push('Additional Elective');
  }
  if (!displayInfo.electives.elective4) {
    formatMajorElectives.push('Additional Elective (can be substituted with two physics classes if applicable)')
  }

  const capstoneIndex = formatMajorElectives.findIndex(
    (e) => e === 'Capstone Elective' || e === 'CSE Capstone Elective'
  );

  if (capstoneIndex !== -1) {
    // Remove the Capstone Elective from the array
    const [capstoneElective] = formatMajorElectives.splice(capstoneIndex, 1);
    // Add it to the end of the array
    formatMajorElectives.push(capstoneElective);
  }


  return (
    <>
      <Box sx={{ width: '100%', mt: 4, padding: 2, border: '1px solid #78909c' }}>
        <Typography sx={{ mb: 2 }} variant="h5" color={orange[500]} gutterBottom fontWeight='bold'>
          Planner Information
        </Typography>
        <Grid container spacing={2}>
          {/* Catalog Year */}
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Catalog Year:`}
              value={displayInfo.catalog}
              color1="textPrimary"
              color2={blue['A400']} />
          </Grid>

          {/* Expected Graduation Date */}
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Expected Graduation Date:`}
              value={displayInfo.EGT}
              color1="textPrimary"
              color2={pink['A200']} />
          </Grid>

          {/* University Requirements */}
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`College Core Course:`}
              value={displayInfo.univReq.core ? 'Fulfilled' : 'Required'}
              color1="textPrimary"
              color2={displayInfo.univReq.core ? green['A700'] : red['A200']} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`American History & Institutions Requirement:`}
              value={displayInfo.univReq.ahr ? 'Fulfilled' : 'Required'}
              color1="textPrimary"
              color2={displayInfo.univReq.ahr ? green['A700'] : red['A200']} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Entry Level Writing Requirement:`}
              value={displayInfo.univReq.entry ? 'Fullfilled' : 'Required'}
              color1="textPrimary"
              color2={displayInfo.univReq.entry ? green['A700'] : red['A200']} />
          </Grid>

          {/* Writing Requirements */}
          <Grid size={{ xs: 12 }}>
            <InfoRow
              label={`Required Writing Courses:`}
              value={displayInfo.writing.length > 0 ? displayInfo.writing.join(', ') : 'None'}
              color1="textPrimary"
              color2={displayInfo.writing.length > 0 ? red['A200'] : 'textSecondary'} />
          </Grid>

          {/* Unfulfilled GE Requirements */}
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Unsatisfied General Education Requirements:`}
              value={displayInfo.GE.length > 0 ? displayInfo.GE.join(', ') : 'None'}
              color1="textPrimary"
              color2={displayInfo.GE.length > 0 ? red['A200'] : 'textSecondary'} />
          </Grid>

          {/* Allowed Major Courses */}
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Required Major Courses That Can Be Taken Next Quarter:`}
              value={formatAllowedMajorCourses.length > 0 ? formatAllowedMajorCourses.join(', ') : 'None'}
              color1="textPrimary"
              color2={formatAllowedMajorCourses.length > 0 ? blue[500] : 'textSecondary'} />
          </Grid>

          {/* Locked Major Courses */}
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Required Major Courses With Prerequisites Needed:`}
              value={formatLockedMajorCourses.length > 0 ? formatLockedMajorCourses.join(', ') : 'None'}
              color1="textPrimary"
              color2={formatLockedMajorCourses.length > 0 ? orange[400] : 'textSecondary'} />
          </Grid>

          {/* Electives */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body1"
              fontSize={{ xs: '0.75rem', sm: '0.85rem' }}
              color='textPrimary'
              fontWeight="bold"
            >
              {`Required Major Elective(s):`}
            </Typography>

            {formatMajorElectives.length > 0 ? (
              formatMajorElectives.map((elective, index) => (
                <Typography
                  key={index}
                  sx={{ mt: 0.75 }} // Add margin for better spacing if needed
                  variant="body2"
                  color={purple['A100']}
                >
                  {`${index + 1}. ${elective}`}
                </Typography>
              ))
            ) : (
              <Typography
                variant="body2"
                color='textSecondary'
              >
                None
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', mb: 4, padding: 2, border: '1px solid #78909c' }}>
        <Typography sx={{ mb: 2 }} variant="h5" color={cyan[600]} gutterBottom fontWeight='bold'>
          Key
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`GE Course:`}
              value={`Choose a GE course from one of your unsatisfied GE Requirements.`}
              color1={green[400]}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Major Course:`}
              value={`Required Core Major Courses.`}
              color1={blue[500]}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Major Elective:`}
              value={`Choose a Major Elective from the valid electives list from your major, 
                while adhering to major elective constraints/requirements (shown in Planner Information).`}
              color1={purple['A100']}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Capstone Elective:`}
              value={`Choose a Capstone Elective from the valid capstone electives list from your major.`}
              color1={teal['A700']}
              color2="textPrimary" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow label={`Elective:`}
              value={`This course is entirely at your discretion. 
                You can use it to fulfill university requirements, pursue courses for your minor, 
                or explore any other subjects of interest. 
                Electives provide flexibility to tailor your education 
                to your personal and academic goals.`}
              color1={cyan[500]}
              color2="textPrimary" />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};


interface InfoRowProps {
  label: string;
  value: string;
  color1: string;
  color2: string;
}

const InfoRow = ({ label, value, color1, color2 }: InfoRowProps) => {
  return (
    <>
      <Typography variant="body1" fontSize={{ xs: '0.75rem', sm: '0.85rem' }} color={color1} fontWeight="bold" display="inline">
        {label}
      </Typography>
      <Typography sx={{ ml: 0.75 }} variant="body2" color={color2} display="inline">
        {value}
      </Typography>
    </>
  );
};
