import 'server-only'

import { FormContextType } from '../(background-form)/context/FormContext';

const q = ['W', 'S', 'F']

const GE = ['CC', 'ER', 'IM', 'MF', 'SI', 'SR', 'TA', 'PE', 'PR', 'C'] as const;

const CS_MajorCourses = [
  'MATH19A', 'MATH19B', 'MATH21', 'MATH23A',
  'CSE12', 'CSE13S', 'CSE16', 'CSE20', 'CSE30', 'CSE40',
  'AM10', 'AM30', 'ECE30', 'STAT131',
  'CSE101', 'CSE101M', 'CSE102', 'CSE103', 'CSE107', 'CSE114A', 'CSE115A', 'CSE120', 'CSE130', 'CSE185S', 'CSE195'
] as const;

const CS_MajorElectives = [
  'CSE100', 'CSE101M', 'CSE104', 'CSE105', 'CSE108', 'CSE109',
  'CSE110A', 'CSE111', 'CSE113', 'CSE115B', 'CSE117', 'CSE118',
  'CSE122', 'CSE123A', 'CSE123B', 'CSE125', 'CSE132', 'CSE142', 'CSE146',
  'CSE150', 'CSE151', 'CSE164', 'CSE166A', 'CSE180', 'CSE186', 'CSE195'
];

const CS_CapstoneElectives = [
  'CSE110B', 'CSE115C', 'CSE115D', 'CSE121', 'CSE134', 'CSE138',
  'CSE140', 'CSE143', 'CSE144', 'CSE156', 'CSE157', 'CSE160',
  'CSE163', 'CSE168', 'CSE181', 'CSE183', 'CSE187', 'CMPM172'
];

const CS_AlternativeElectives = [
  'AM114', 'AM147', 'CMPM120', 'CMPM131', 'CMPM146', 'CMPM163', 'CMPM164', 'CMPM171', 'CMPM172',
  'MATH110', 'MATH115', 'MATH116', 'MATH117', 'MATH118', 'MATH134', 'MATH145', 'MATH148', 'MATH160',
  'MATH161', 'STAT132', 'PHYS5B', 'PHYS5C', 'PHYS6B', 'PHYS6C'
];

// const CSPreReq = {
//   MATH3: ['MATH19A', 'AM10'],
//   MATH19A: ['MATH19B', 'MATH21'],
//   MATH19B: ['MATH23A', 'ECE30', 'CSE40', 'STAT131'],
//   MATH21: [],
//   MATH23A: ['CSE107'],
//   CSE12: ['CSE13S', 'CSE101'],
//   CSE13S: ['CSE101'],
//   CSE16: ['CSE101', 'CSE107'],
//   CSE20: ['CSE30', 'CSE12'],
//   CSE30: ['CSE40', 'CSE101'],
//   CSE40: [],
//   AM10: ['AM30'],
//   ECE30: [],
//   STAT131: [],
//   CSE101: ['CSE101M', 'CSE102', 'CSE103', 'CSE114A', 'CSE115A', 'CSE130', 'CSE185S'],
// }

export async function getNumQuartersBetweenStartAndEndDate(start: string, end: string) {
  let numQuarters = 0;
  let startQ = start.charAt(0);
  let startYear = parseInt(start.slice(1), 10);
  const endQ = end.charAt(0);
  const endYear = parseInt(end.slice(1), 10);

  while (startQ != endQ) {
    numQuarters++;
    if (q.indexOf(startQ) === 2) {
      startYear++;
    }
    startQ = q[(q.indexOf(startQ) + 1) % 3];
  }

  if (startYear !== endYear) {
    numQuarters += (((endYear - startYear) * 3) + 1)
  } else {
    numQuarters++;
  }

  return numQuarters;
}

async function getDifference(array1: readonly string[], array2: string[]) {
  return array1.filter(item => !array2.includes(item));
}

async function checkCSElectiveRequirements(allCompletedElectives: string[], electiveReq: { [key: string]: boolean }) {
  const courseType = (course: string, prefix: string) => course.startsWith(prefix);
  const checkValidMajorElective = (course: string) => {
    return CS_MajorElectives.includes(course) || CS_CapstoneElectives.includes(course) || CS_AlternativeElectives.includes(course)
  }

  for (const course of allCompletedElectives) {
    if (!electiveReq.capstone && CS_CapstoneElectives.includes(course)) {
      electiveReq.capstone = true;
    }

    // Elective 1: Must be an upper-div CSE course
    if (!electiveReq.elective1 && courseType(course, 'CSE')) {
      electiveReq.elective1 = true;
      continue;
    }

    // Elective 2: Must be either an upper-div CSE or valid CMPM course
    if (!electiveReq.elective2 && (courseType(course, 'CSE') || courseType(course, 'CMPM')) && checkValidMajorElective(course)) {
      electiveReq.elective2 = true;
      continue;
    }

     // Elective 3: Any valid CS elective course except PHYS
     if (!electiveReq.elective3 && !courseType(course, 'PHYS') && checkValidMajorElective(course)) {
      electiveReq.elective3 = true;
      continue;
    }

    // Elective 4: Any valid CS elective in General Catalog
    if (!electiveReq.elective4 && checkValidMajorElective(course)) {
      electiveReq.elective4 = true;
      continue;
    }
  }

  return electiveReq;

}

async function getNeededCSElectives(electiveReq: { [key: string]: boolean }) {
  const neededElectives = [];
  let hasCapstone = electiveReq.capstone;

  if (!electiveReq.elective2) {
    neededElectives.push(hasCapstone ? 'Major Elective' : 'Capstone Elective');
    hasCapstone = true;
  }
  if (!electiveReq.elective1) {
    neededElectives.push(hasCapstone ? 'Major Elective' : 'Capstone Elective (CSE)');
    hasCapstone = true;
  }
  if (!hasCapstone) {
    neededElectives.push('Capstone Elective');
  }
  if (!electiveReq.elective3) {
    neededElectives.push('Major Elective');
  }
  if (!electiveReq.elective4) {
    neededElectives.push('Major Elective')
  }
  
  return neededElectives;
}

export default async function getPlanners(formContext: FormContextType) {
  const catalog = formContext.infoData.catalogYear;
  const gradDate = parseInt(formContext.infoData.gradDate, 10);
  const startDate = formContext.infoData.startPlanner;
  const plannerType = formContext.infoData.planner;
  let numQuartersToGenerate = await getNumQuartersBetweenStartAndEndDate(formContext.infoData.startPlanner, formContext.infoData.gradDate);
  if (plannerType === '1') {
    numQuartersToGenerate = numQuartersToGenerate < 3 ? numQuartersToGenerate : 3;
  } else if (plannerType === '3') {
    numQuartersToGenerate = 1;
  }
  const student = formContext.studentStatus;
  const mathPlacement = formContext.undergradData.math;
  const writingPlacement = formContext.undergradData.writing;
  const testout = formContext.undergradData.testout;
  const universityReq = {
    ahr: formContext.backgroundCourseData.universityReq.ahr === 'T' ? true : false, 
    entry: formContext.backgroundCourseData.completedGeneralEdCourses.includes('C') || formContext.undergradData.writing === '2',
    core: formContext.backgroundCourseData.universityReq.coreCourse
  }
  let neededGeneralEdCourses = await getDifference(GE, formContext.backgroundCourseData.completedGeneralEdCourses);
  let neededMajorCourses = await getDifference(CS_MajorCourses, formContext.backgroundCourseData.completedMajorCourses);
  let completedMajorElectives = formContext.backgroundCourseData.completedMajorElectives;
  let completedCapstoneElectives = formContext.backgroundCourseData.completedCapstoneElectives;
  let completedAlternativeElectives = formContext.backgroundCourseData.completedAlternativeElectives;
  const majorChoices = formContext.majorChoices;

  let allCompletedElectives = [...completedCapstoneElectives, ...completedMajorElectives, ...completedAlternativeElectives];

  // For 2023-2024 Catalog set elective 2 to true as default
  let electiveReq = {elective1: false, elective2: catalog === '23' ? true : false, elective3: false, elective4: false, capstone: false}
  
  await checkCSElectiveRequirements(allCompletedElectives, electiveReq);

  let neededElectives = await getNeededCSElectives(electiveReq);

  let numCoursesPerQuarter = formContext.numCoursesPreference.numCoursesPerQuarter.map(Number);
  if (numQuartersToGenerate > 1 && numCoursesPerQuarter.length === 1) {
    numCoursesPerQuarter = Array(numQuartersToGenerate).fill(numCoursesPerQuarter[0]);
  }

  // Each element will be an array (schedule), where each element in each array will be an object with quarter and courses attributes
  // Example: {quarter: 'Fall 2024', courses: ['CSE 114A', 'CSE 115A', 'CSE 144']}
  const planners = [];

  async function generateNextQuarter() {

  }

  async function generatePlanners() {
    
  }

  if (numQuartersToGenerate === 1) {

  } else if (numQuartersToGenerate <= 3) {
    let numMajorCourses = formContext.numCoursesPreference.numMajorCourses.map(Number);
    if (numMajorCourses.length === 1) {
      numMajorCourses = Array(numQuartersToGenerate).fill(numMajorCourses[0]);
    }
    // Call Function to Fill Next Quarter Schedule: generateNextQuarter(planners);
    // Call Recursive Function:  generatePlanners(, numQuartersToGenerate)
  } else {
    // Call Function to Fill Next Quarter Schedule: generateNextQuarter(planners);
    // Call Recursive Function:  generatePlanners(, numQuartersToGenerate)
  }


}


/*
InfoData:
  General Catalog (22, 23, 24)
  Major (CS)
  EGT
  Type of Planner (1: 3 quarters, 2: Entire Planner to EGT, 3: Next Quarter)
  Planner Start Date (in Form) / Start Term (Visual Planner Site)

Student Status: Incoming Undergraduate (U), Incoming Transfer (T), Continuing Student (C)

UndergradData:
  Math Placement (Required for U Student Status, and for visual planner generation):
    U Student Status: Either 3, 19A, 19B, or 20 (completed 19B through transfer credit)
    Visual Planner Site: Either 3, 19A, 19B, or 20 (completed 19B)
  Writing Placement (Required):
    Form: 25, 26, 1, 2, or empty (if C GE was checked)
    Visual Planner Site: Either 25, 26, 1, 2, or C (completed)
  Testout (Required only for U Student Status):
    Must have 'CSE20' property in object

  BackgroundCourseData:
    University Requirements (Required):
      AHR: 'T' (true) or 'F' (false)
      Entry-Level Writing: true or false (boolean) // This will be depreciated in formContext
      Core Course / College:
        Form:
          C, S, T, M, P, K, O, R, N, or J (if U student Status)
          1 or 2 (if Continuing Student Status)
        Visual Planner Site:
          C, S, T, M, P, K, O, R, N, or J
    Completed General Education Courses (Required)
    Completed Major Courses (Required for Form, Required only for Transfer Students in Visual Planner Site)
    Completed Major Electives (Required only for Form)
    Completed Capstone Electives (Required only for Form)
    Completed Alternative Electives (Required only for Form)
  
NumCoursesPreference:
  Number of Courses/Quarter (Required for Form, in Advanced Settings in Visual Planner Site):
    Array Length of 1: number applied to all quarters
    Array Length > 1: specific number of courses/quarter
  Number of Major Courses/Quarter (Required only for Form):
    Array Length of 1: number applied to all quarters
    Array Length = 3: specific number of major courses/quarter

MajorChoices (Required for Form, in Advanced Settings in Visual Planner Site)
*/
