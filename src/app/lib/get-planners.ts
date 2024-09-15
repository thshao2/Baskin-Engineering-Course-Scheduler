import 'server-only';

import { FormContextType } from '../(background-form)/context/FormContext';
import {
  getNumQuartersBetweenStartAndEndDate,
  getDifference, getNeededCSElectives, 
  getPriorityList, getInDegreeList,
  GE, CS_MajorCourses, checkCSElectiveRequirements,
  getQuarterName
} from './helper'

export async function generateCoursesForQuarter(courses: string[], x: number): Promise<string[][]> {
  const result: string[][] = [];

  async function generateCombination(start: number, currentCombo: string[]) {
    // If the combination is of size x, add it to the result
    if (currentCombo.length === x) {
      result.push([...currentCombo]);
      return;
    }

    // Generate combinations
    for (let i = start; i < courses.length; i++) {
      currentCombo.push(courses[i]);
      generateCombination(i + 1, currentCombo);
      currentCombo.pop(); // Backtrack to try another combination
    }
  }

  await generateCombination(0, []);
  return result;
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
  let writingPlacement = formContext.undergradData.writing;
  const universityReq = {
    ahr: formContext.backgroundCourseData.universityReq.ahr === 'T' ? true : false,
    entry: formContext.backgroundCourseData.completedGeneralEdCourses.includes('C') || writingPlacement === '2',
    core: formContext.backgroundCourseData.universityReq.coreCourse
  }
  let neededGeneralEdCourses = await getDifference(GE, formContext.backgroundCourseData.completedGeneralEdCourses);
  let neededMajorCourses = await getDifference(CS_MajorCourses, formContext.backgroundCourseData.completedMajorCourses);
  let completedMajorElectives = formContext.backgroundCourseData.completedMajorElectives;
  let completedCapstoneElectives = formContext.backgroundCourseData.completedCapstoneElectives;
  let completedAlternativeElectives = formContext.backgroundCourseData.completedAlternativeElectives;
  const majorChoices = formContext.majorChoices;

  if (neededGeneralEdCourses.includes('C') && writingPlacement !== '2') {
    const writingLevels = ['25', '26', '1'];
    const index = writingLevels.indexOf(writingPlacement);
    for (let i = index; i < writingLevels.length; i++) {
      neededGeneralEdCourses.push(writingLevels[i]);
    }
  }

  let allCompletedElectives = [...completedCapstoneElectives, ...completedMajorElectives, ...completedAlternativeElectives];

  // For 2023-2024 Catalog set elective 2 to true as default
  let electiveReq = { elective1: false, elective2: catalog === '23' ? true : false, elective3: false, elective4: false, capstone: false }

  await checkCSElectiveRequirements(allCompletedElectives, electiveReq);

  let neededElectives = await getNeededCSElectives(electiveReq);

  let numCoursesPerQuarter = formContext.numCoursesPreference.map(Number);
  if (numQuartersToGenerate > 1 && numCoursesPerQuarter.length === 1) {
    numCoursesPerQuarter = Array(numQuartersToGenerate).fill(numCoursesPerQuarter[0]);
  }

  // Each element will be an array (schedule), where each element in each array will be an object with quarter and courses attributes
  // Example: {quarter: 'Fall 2024', courses: ['CSE 114A', 'CSE 115A', 'CSE 144']}
  const planners = [];
  const priorityList = await getPriorityList();
  let inDegreeObject = await getInDegreeList(neededMajorCourses);

  /* 
  Consider: 
  Is this the student's first quarter? => Core Course
  Student's second quarter and in Stevenson? => Core Course Part 2
  Still have GE Requirements? => CC, ER, IM, MF, SI, SR, TA, PE, PR
  Still have Writing Requirements? => Writing 25, 26, 1, or 2
    Writing 25: Offered only in Fall
    Writing 26: Offered in Fall, Winter
    Writing 1: Offered most in Winter, Spring
    Writing 2: Offered most in Fall, Spring
  Still need to satisfy AHR? => will be put in elective
  */
  async function generateFirstQuarter() {
    let numCourses = numCoursesPerQuarter[0];
    const addToCourses = [];
    if (student === 'U') {
      numCourses--;
      addToCourses.push('College Core Course');
    }
    if (student === 'C' && universityReq.core === '2') {
      numCourses--;
      addToCourses.push('College Core Course (Part 2)');
    }
    const startQuarter = startDate.charAt(0);
    if (writingPlacement === '25' && startQuarter === 'F') {
      numCourses--;
      addToCourses.push('Writing 25');
      writingPlacement = '26';
    } else if (writingPlacement === '26' && (startQuarter === 'F' || startQuarter === 'W')) {
      numCourses--;
      addToCourses.push('Writing 26');
      writingPlacement = '1';
    } else if (writingPlacement === '1' && (startQuarter === 'W' || startQuarter === 'S')) {
      numCourses--;
      addToCourses.push('Writing 1/Writing 1E');
      writingPlacement = '2T'; // This will need to be put on hold
    }

    const queue = [];
    for (const course in inDegreeObject) {
      if (inDegreeObject[course] === 0) {
        queue.push(course);
      }
    }
    let temp = [];
    for (let i = 1; i <= numCourses; i++) {
      // let activeNeededGERequirements = [...neededGeneralEdCourses];
      temp = await generateCoursesForQuarter(queue, i);
      const date = await getQuarterName(startDate);
      const fillCourses = [...addToCourses];
      for (let j = 0; j < numCourses - i; i++) {
        if (writingPlacement === '2' && (startQuarter === 'F' || startQuarter === 'S')){
          fillCourses.push('Writing 2/Writing 2H');
          writingPlacement = 'C';
          neededGeneralEdCourses = neededGeneralEdCourses.filter(ge => ge !== 'C');
          continue;
        }
        if (neededGeneralEdCourses.length > 1 || (neededGeneralEdCourses.length === 1 && neededGeneralEdCourses[0] !== 'C')) {
          fillCourses.push('GE Course')
          const indexToRemove = neededGeneralEdCourses.findIndex(ge => ge !== 'C');
          neededGeneralEdCourses.splice(indexToRemove, 1)
          continue;
        }
        fillCourses.push('Elective');
      }
      for (const courses of temp) {
        const newCourses = [...courses, ...fillCourses];
        planners.push({quarter: date, courses: newCourses});
      }
    }
    if (writingPlacement === '2T') {
      writingPlacement = '2';
    }
  }

  async function generatePlanners() {

  }

  if (numQuartersToGenerate === 1) {

  } else if (numQuartersToGenerate <= 3) {
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

  BackgroundCourseData:
    University Requirements (Required):
      AHR: 'T' (true) or 'F' (false)
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
  
NumCoursesPreference (Required for Form, in Advanced Settings in Visual Planner Site):
    Array Length of 1: number applied to all quarters
    Array Length > 1: specific number of courses/quarter

MajorChoices (Required for Form, in Advanced Settings in Visual Planner Site)
*/
