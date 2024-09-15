import 'server-only';

import { FormContextType } from '../(background-form)/context/FormContext';
import {
  getNumQuartersBetweenStartAndEndDate,
  getDifference, getNeededCSElectives,
  getPriorityList, getInDegreeList,
  GE, CS_MajorCourses, checkCSElectiveRequirements,
  getQuarterName,
  getElectivesToAdd, EquivalentCSCourses, newEquivalentCSCourses
} from './helper'

export type quarterSchedule = {
  quarter: string,
  courses: string[],
}

type currentSnapshot = {
  currentTerm: string,
  quarterNum: number,
  writingPlacement: string,
  coreCourse: string,
  neededGeneralEdCourses: string[],
  neededMajorCourses: string[],
  neededElectives: string[],
}

export async function generateCoursesForQuarter(courses: string[], x: number): Promise<string[][]> {
  // const result: string[][] = [];

  const result: Set<string> = new Set();

  async function generateCombination(start: number, currentCombo: string[]) {
    // If the combination is of size x, add it to the result
    if (currentCombo.length === x) {
      const sortedCombo: string[] = [...currentCombo].sort()
      result.add(JSON.stringify(sortedCombo));
      return;
    }

    // Generate combinations
    for (let i = start; i < courses.length; i++) {
      currentCombo.push(courses[i]);
      await generateCombination(i + 1, currentCombo);
      currentCombo.pop(); // Backtrack to try another combination
    }
  }

  await generateCombination(0, []);
  // Convert the set of strings back to an array of arrays
  return Array.from(result).map(item => JSON.parse(item));
}

export default async function getPlanners(formContext: FormContextType) {
  // InfoData: Catalog, Graduation Date, Start Term, Planner Type, Number of Quarters to Generate
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

  // Student Status: 'U', 'T', or 'C'
  const student = formContext.studentStatus;

  // Math Placement, Writing Placement:
  const mathPlacement = formContext.undergradData.math;
  let writingPlacement = formContext.undergradData.writing;

  // University Requirements: AHR, Entry-Level Writing Requirement, College Core Course
  const universityReq = {
    ahr: formContext.backgroundCourseData.universityReq.ahr === 'T' ? true : false,
    entry: formContext.backgroundCourseData.completedGeneralEdCourses.includes('C') || writingPlacement === '2',
    core: formContext.backgroundCourseData.universityReq.coreCourse
  }

  // Needed General Education Requirements
  let neededGeneralEdCourses = await getDifference(GE, formContext.backgroundCourseData.completedGeneralEdCourses);

  const completedMajorCourses = formContext.backgroundCourseData.completedMajorCourses;

  // Update Completed Major Courses array to include courses satisfied through math placement (only if undergrad)
  // Example: if placed in MATH 19B, include 'MATH3' and 'MATH19A'
  if (student === 'U') {
    if (mathPlacement === '20') {
      completedMajorCourses.push(...['MATH3', 'MATH19A', 'MATH19B'])
    } else if (mathPlacement === '19B') {
      completedMajorCourses.push(...['MATH3', 'MATH19A'])
    } else if (mathPlacement === '19A') {
      completedMajorCourses.push(...['MATH3'])
    }
  } else {
    if (completedMajorCourses.includes('MATH19B')) {
      completedMajorCourses.push(...['MATH3', 'MATH19A'])
    } else if (completedMajorCourses.includes('MATH19A')) {
      completedMajorCourses.push(...['MATH3'])
    }
  }

  // Add Equivalency Major Courses
  const equivalency = [];
  const equivList = parseInt(catalog, 10) > 23 ? newEquivalentCSCourses : EquivalentCSCourses;
  for (const course of completedMajorCourses) {
    if (equivList[course] !== undefined) {
      for (const equivCourse of equivList[course]) {
        equivalency.push(equivCourse);
      }
    }  
  }

  completedMajorCourses.push(...equivalency);

  // Needed Major Courses
  let neededMajorCourses = await getDifference(CS_MajorCourses, completedMajorCourses);

  // Already Completed Electives 
  const completedMajorElectives = formContext.backgroundCourseData.completedMajorElectives;
  const completedCapstoneElectives = formContext.backgroundCourseData.completedCapstoneElectives;
  const completedAlternativeElectives = formContext.backgroundCourseData.completedAlternativeElectives;
  let allCompletedElectives = [...completedCapstoneElectives, ...completedMajorElectives, ...completedAlternativeElectives];

  // Major Course Choices Preference
  const majorChoices = formContext.majorChoices;

  // Update General Education Requirements array to include ALL writing courses needed 
  /* Example: if placed in Writing 1, include '1' as well as 'C', representing Writing 1 AND Writing 2
              are both needed to meet General Education requirements */
  if (neededGeneralEdCourses.includes('C') && writingPlacement !== '2') {
    const writingLevels = ['25', '26', '1'];
    const index = writingLevels.indexOf(writingPlacement);
    for (let i = index; i < writingLevels.length; i++) {
      neededGeneralEdCourses.push(writingLevels[i]);
    }
  }

  // For 2023-2024 Catalog set elective 2 to true as default
  let electiveReq = { elective1: false, elective2: catalog === '23' ? true : false, elective3: false, elective4: false, capstone: false }

  // Update actual completed major electives in electiveReq based on the major elective requirements 
  await checkCSElectiveRequirements(allCompletedElectives, electiveReq);

  // Put Needed CSE Electives in an array, with consideration that one capstone elective can count for
  // a major elective (i.e. ['Capstone Elective', 'Major Elective', 'Major Elective'])
  let neededElectives = await getNeededCSElectives(electiveReq);

  // Convert numCoursesPerQuarter settings into an array of number type
  let numCoursesPerQuarter = formContext.numCoursesPreference.map(Number);

  // If user did not use advanced settings, map the same number to a new array of length ${numQuarterstoGenerate}, each element
  // being the same number
  if (numQuartersToGenerate > 1 && numCoursesPerQuarter.length === 1) {
    numCoursesPerQuarter = Array(numQuartersToGenerate).fill(numCoursesPerQuarter[0]);
  }

  // Each element will be an array (schedule), where each element in each array will be an object with quarter and courses attributes
  // Example: {quarter: 'Fall 2024', courses: ['CSE 114A', 'CSE 115A', 'CSE 144']}
  const planners: quarterSchedule[][] = [];

  // Each element will be an array (snapshots for a specific schedule),
  // where each element in each array will be an object with quarter and snapshot attributes
  // The snapshot attribute will carry the updated attributes (GE requirements, needed major courses, etc.)
  // after completion of this quarter
  // Example: {quarter: 'Fall 2024', snapshot: currentSnapshot}
  const snapshots = [];

  // Get Priority Object of each Major Course, determined by satisfaction count of course (to be able to take future major courses)
  const priorityObject = await getPriorityList();

  // Get In-Degree Object of current user state in major courses
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

  Still to Consider in Algorithm:
    DC Requirement => Senior Thesis shouldn't show until 4 or more core completed
                      185S shouldn't show unless 2 or more core completed
                      115A => Prereq.
    Major Choices
    Eqivalency courses should NOT collide
    Let user pick # of major courses after generation?
    Remember 101M not required in 22 catalog
  */
  async function generateFirstQuarter() {
    const nextSnapshot: currentSnapshot = {
      currentTerm: startDate, // increment this
      quarterNum: 1,
      writingPlacement: writingPlacement,
      coreCourse: universityReq.core,
      neededGeneralEdCourses: neededGeneralEdCourses,
      neededMajorCourses: neededMajorCourses,
      neededElectives: neededElectives
    }
    let numCourses = numCoursesPerQuarter[0];
    const addToCourses = [];
    if (student === 'U') {
      numCourses--;
      addToCourses.push('College Core Course');
      if (universityReq.core === 'S') {
        nextSnapshot.coreCourse = '2';
      } else {
        nextSnapshot.coreCourse = '1';
      }
    }
    if (student === 'C' && universityReq.core === '2') {
      numCourses--;
      addToCourses.push('College Core Course (Part 2)');
      nextSnapshot.coreCourse = '1';
    }
    const startQuarter = startDate.charAt(0);
    if (writingPlacement === '25' && startQuarter === 'F') {
      numCourses--;
      addToCourses.push('Writing 25');
      nextSnapshot.writingPlacement = '26';
    } else if (writingPlacement === '26' && (startQuarter === 'F' || startQuarter === 'W')) {
      numCourses--;
      addToCourses.push('Writing 26');
      nextSnapshot.writingPlacement = '1';
    } else if (writingPlacement === '1' && (startQuarter === 'W' || startQuarter === 'S')) {
      numCourses--;
      addToCourses.push('Writing 1/Writing 1E');
      nextSnapshot.writingPlacement = '2T';
    }

    const queue = [];
    for (const course in inDegreeObject) {
      if (inDegreeObject[course] === 0) {
        queue.push(course);
      }
    }
    let temp = [];
    const electiveIndex = await getElectivesToAdd(nextSnapshot.neededMajorCourses, nextSnapshot.neededElectives);
    queue.push(...nextSnapshot.neededElectives.slice(0, electiveIndex));
    const numMajorCoursesStart = numCourses > 4 ? 4 : numCourses;
    for (let i = numMajorCoursesStart; i >= 1; i--) {
      temp = await generateCoursesForQuarter(queue, i);
      const date = await getQuarterName(startDate);
      const fillCourses = [...addToCourses];
      const newNextSnapshot = structuredClone(nextSnapshot);
      for (let j = 0; j < numCourses - i; j++) {
        if (newNextSnapshot.writingPlacement === '2' && (startQuarter === 'F' || startQuarter === 'S') && student !== 'U') {
          fillCourses.push('Writing 2/Writing 2H');
          newNextSnapshot.writingPlacement = 'C';
          newNextSnapshot.neededGeneralEdCourses = newNextSnapshot.neededGeneralEdCourses.filter(ge => ge !== 'C');
          continue;
        }
        if (newNextSnapshot.neededGeneralEdCourses.length > 1 ||
          (newNextSnapshot.neededGeneralEdCourses.length === 1 && newNextSnapshot.neededGeneralEdCourses[0] !== 'C')) {
          fillCourses.push('GE Course')
          const indexToRemove = newNextSnapshot.neededGeneralEdCourses.findIndex(ge => ge !== 'C');
          newNextSnapshot.neededGeneralEdCourses.splice(indexToRemove, 1)
          continue;
        }
        fillCourses.push('Elective');
      }
      for (const courses of temp) {
        const newCourses = [...courses, ...fillCourses];
        planners.push([{ quarter: date, courses: newCourses }]);
        const finalSnapshotInstance = structuredClone(newNextSnapshot);
        for (const course of courses) {
          if (course.includes('Elective')) {
            const indexToRemove = finalSnapshotInstance.neededElectives.findIndex(e => e === course);
            finalSnapshotInstance.neededElectives.splice(indexToRemove, 1);
          } else {
            finalSnapshotInstance.neededMajorCourses = finalSnapshotInstance.neededMajorCourses.filter(c => c !== course)
            const equivList = Number(catalog) > 23 ? newEquivalentCSCourses : EquivalentCSCourses;
            if (equivList[course] !== undefined) {
              for (const equivCourse of equivList[course]) {
                finalSnapshotInstance.neededMajorCourses = finalSnapshotInstance.neededMajorCourses.filter(c => c !== equivCourse)
              }
            }
          }
        }
        if (finalSnapshotInstance.writingPlacement === '2T') {
          finalSnapshotInstance.writingPlacement = '2';
        }
        snapshots.push([{ quarter: date, snapshot: finalSnapshotInstance }]);
      }
    }
  }

  async function generatePlanners() {

  }

  if (numQuartersToGenerate === 1) {

    await generateFirstQuarter();

    return planners;

  } else if (numQuartersToGenerate <= 3) {

    // Call Function to Fill Next Quarter Schedule: await generateNextQuarter();
    await generateFirstQuarter();

    return planners;
    // Call Recursive Function:  generatePlanners(, numQuartersToGenerate)

  } else {

    // Call Function to Fill Next Quarter Schedule: generateNextQuarter(planners);
    await generateFirstQuarter();

    return planners;

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
// Considering deprecation in lieu of filtering capabilities after schedule generation
*/
