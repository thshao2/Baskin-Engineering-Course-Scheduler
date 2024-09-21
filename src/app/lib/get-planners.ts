import 'server-only';

import { FormContextType } from '../(background-form)/context/FormContext';
import {
  getNumQuartersBetweenStartAndEndDate, getDifference, incrementQuarter, getQuarterName,
  getNeededCSElectives, getPriorityList, getInDegreeList, getCoreUpperCoursesCount, getElectivesToAdd, checkCSElectiveRequirements,
  GE, CS_MajorCourses, EquivalentCSCourses, newEquivalentCSCourses,
} from './helper'

import { generateCoursesForQuarter, getTopPriorityCourses } from './get-planners-algs';

export type quarterSchedule = {
  quarter: string,
  courses: string[],
}

export type DisplayElement = {
  catalog: string,
  EGT: string,
  allowedMajorCourses: string[]
  lockedMajorCourses: string[],
  GE: string[],
  univReq: { ahr: boolean, entry: boolean, core: boolean },
  writing: string[],
  electives: { [key: string]: boolean | string[] },
  quarters: number,
}

type Planners = [DisplayElement, ...quarterSchedule[][][]];

type Snapshot = {
  nextTerm: string,
  writingPlacement: string,
  coreCourse: string,
  neededGeneralEdCourses: string[],
  neededMajorCourses: string[],
  neededElectives: string[],
}

export default async function getPlanners(formContext: FormContextType) {
  // InfoData: Catalog, Graduation Date, Start Term, Planner Type, Number of Quarters to Generate
  const catalog = parseInt(formContext.infoData.catalogYear, 10);
  const gradDate = formContext.infoData.gradDate;
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
    ahr: formContext.backgroundCourseData.ahr === 'T' ? true : false,
    entry: formContext.backgroundCourseData.completedGeneralEdCourses.includes('C') || writingPlacement === '2',
    core: formContext.infoData.college
  }

  // Needed General Education Requirements
  let neededGeneralEdCourses = await getDifference(GE, formContext.backgroundCourseData.completedGeneralEdCourses);

  // Copy Array for Display GE Courses
  const displayNeededGECourses = [...neededGeneralEdCourses];

  // Completed Major Courses
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
  const equivList = catalog > 23 ? newEquivalentCSCourses : EquivalentCSCourses;
  for (const course of completedMajorCourses) {
    if (equivList[course] !== undefined) {
      for (const equivCourse of equivList[course]) {
        equivalency.push(equivCourse);
      }
    }
  }

  // CSE 101M not required in 2022-2023 catalog
  if (catalog === 22 && !completedMajorCourses.includes('CSE101M')) {
    equivalency.push('CSE101M');
  }

  // CSE 40 not required in 2022-2023 catalog
  if (catalog === 22 && !completedMajorCourses.includes('CSE40')) {
    equivalency.push('CSE40');
  }

  completedMajorCourses.push(...equivalency);

  // Needed Major Courses
  let neededMajorCourses = await getDifference(CS_MajorCourses, completedMajorCourses);

  // Already Completed Electives 
  const completedMajorElectives = formContext.backgroundCourseData.completedMajorElectives;
  const completedCapstoneElectives = formContext.backgroundCourseData.completedCapstoneElectives;
  const completedAlternativeElectives = formContext.backgroundCourseData.completedAlternativeElectives;
  let allCompletedElectives = [...completedCapstoneElectives, ...completedMajorElectives, ...completedAlternativeElectives];

  const displayWritingCoursesNeeded = [];

  // If C General Education Requirement has already been completed, set writing placement to "C"
  if (!neededGeneralEdCourses.includes('C')) {
    writingPlacement = 'C';
  }

  // Update Display Writing Courses Array to include ALL writing courses needed
  /* Example: if placed in Writing 1, include '1' as well as 'C', representing Writing 1 AND Writing 2
              are both needed to meet General Education requirements */
  if (neededGeneralEdCourses.includes('C')) {
    const writingLevels = ['25', '26', '1', '2'];
    const index = writingLevels.indexOf(writingPlacement);
    for (let i = index; i < writingLevels.length; i++) {
      // neededGeneralEdCourses.push(writingLevels[i]);
      displayWritingCoursesNeeded.push(`WRIT ${writingLevels[i]}`)
    }
  }

  // For 2023-2024 Catalog set elective 2 to true as default
  let electiveReq = { elective1: false, elective2: catalog === 23 ? true : false, elective3: false, elective4: false, capstone: false }

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

  /*
  New Planners Array:
    Each element will be an array:
      The first array will represent the display that will be shown to the user, with information such as:
        [{Catalog, Expected Graduation Term
        Major Courses that can be taken (take account of equivlency courses), 
        Major courses that can not be taken until prereq. are completed (take account of equivalency courses),
        Unfulfilled GE's
        University Requirements: AHR, College Core
        Writing Placement, Writing Courses to take, Entry Requirement
        How many electives are still needed (and what types of elective)
        }]
      The corresponding arrays will have quarterSchedule[][] type arrays, each representing different # of major courses taken (by the index) 
      in the first quarter, generated by planner). Each element in the arraay will be an object with quarter and courses
      attributes:
        Example: {quarter: 'Fall 2024', courses: ['CSE 114A', 'CSE 115A', 'CSE 144']}
  */
  // const planners: quarterSchedule[][] = [];

  // Get Priority Object of each Major Course, determined by satisfaction count of course (to be able to take future major courses)
  const priorityObject = await getPriorityList();

  // Get In-Degree Object of current user state in major courses
  let inDegreeObject = await getInDegreeList(neededMajorCourses);

  const displayExpectedGradDate = await getQuarterName(gradDate);
  const equivalencyObj = catalog > 23 ? newEquivalentCSCourses : EquivalentCSCourses;

  /*
  Example:
     [
      detailedPlanners[0],
      [
        [
          {quarter: 'Fall 2024', courses: ['CSE 114A', 'CSE 115A', 'CSE 144']}, 
          {quarter: 'Winter 2025', courses: ['CSE 138', 'CSE 242', 'CSE 244']}
        ], 
        [
          {quarter: 'Fall 2024', courses: ['CSE 114A', 'CSE 115A', 'CSE 150']}, 
          {quarter: 'Winter 2025', courses: ['CSE 138', 'CSE 242', 'CSE 144']}
        ], 
        ...
      ]
      ...

     ]
  */

  const detailedPlanners: Planners = [
    {
      catalog: `${catalog + 2000}-${catalog + 2001}`,
      EGT: displayExpectedGradDate,
      allowedMajorCourses: [],
      lockedMajorCourses: [],
      GE: displayNeededGECourses,
      univReq: {
        ahr: universityReq.ahr,
        entry: universityReq.entry,
        core: (student === 'T' || (student === 'C' && universityReq.core === '1'))
      },
      writing: displayWritingCoursesNeeded,
      electives: { ...electiveReq },
      quarters: numQuartersToGenerate,
    }
  ];

  const detailedSnapshots: Snapshot[][][] = [];

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
    Equivalency courses should NOT collide
    AM 10/MATH 21
    AM 30/MATH 23A
    CSE 107/STAT 131

    Not Equivalent Courses, but preferred not to collide
    CSE 102/CSE 103 (2024-2025 catalog)
    CSE 115A/CSE 185S/CSE 195 (DC)

    Remember 40, 101M not required in 22 catalog (different catalog years)

    Filter:
      Let user pick # of major courses after generation (only for 1 quarter schedule)
      Let user filter by major courses
  */
  async function generateFirstQuarter() {
    const nextQuarter = await incrementQuarter(startDate);
    const nextSnapshot: Snapshot = {
      nextTerm: nextQuarter,
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
    const coreCount = await getCoreUpperCoursesCount(nextSnapshot.neededMajorCourses);
    if (coreCount < 5 && queue.includes('CSE195')) {
      const indexToRemove = queue.findIndex(course => course === 'CSE195');
      queue.splice(indexToRemove, 1);
    }
    if (coreCount < 2 && queue.includes('CSE185S')) {
      const indexToRemove = queue.findIndex(course => course === 'CSE185S');
      queue.splice(indexToRemove, 1);
    }

    detailedPlanners[0].allowedMajorCourses = [...queue];
    const displayLockedMajorCourses = await getDifference(CS_MajorCourses, [...completedMajorCourses, ...detailedPlanners[0].allowedMajorCourses])
    detailedPlanners[0].lockedMajorCourses = displayLockedMajorCourses;

    const numMajorCoursesStart = numCourses > 4 ? 4 : numCourses;
    for (let i = numMajorCoursesStart; i >= 1; i--) {
      detailedPlanners[i] = [];
      detailedSnapshots[i] = [];
      temp = await generateCoursesForQuarter(queue, i, catalog);
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
        (detailedPlanners[i] as quarterSchedule[][]).push([{ quarter: date, courses: newCourses }]);
        const finalSnapshotInstance = structuredClone(newNextSnapshot);
        for (const course of courses) {
          if (course.includes('Elective')) {
            const indexToRemove = finalSnapshotInstance.neededElectives.findIndex(e => e === course);
            finalSnapshotInstance.neededElectives.splice(indexToRemove, 1);
          } else {
            finalSnapshotInstance.neededMajorCourses = finalSnapshotInstance.neededMajorCourses.filter(c => c !== course)
            const equivList = catalog > 23 ? newEquivalentCSCourses : EquivalentCSCourses;
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
        detailedSnapshots[i].push([{ ...finalSnapshotInstance }]);
      }
    }
  }

  /*
    Things to consider in algorithm: 
      Undergraduate (CSE 20 doesn't get priority first quarter b/c first quarter is brute-force)
        Get Top Priority (and swap it with the first element)
        Get NumMajorCourses Priority and set it has the first results that show up



  */

  async function generatePlanners(numQuarters: number) {
    // Iterate through all existing schedules for each quarter
    for (let i = 1; i < numQuarters; i++) {
      // Iterate through groups of schedules (by filtered number of major courses in the first quarter)
      for (let schedulesIndex = 1; schedulesIndex < detailedPlanners.length; schedulesIndex++) {
        /* 
        Example of Schedules Format: 
        [
          [
            {quarter: 'Fall 2024', courses: ['CSE 101', 'CSE 107', 'CSE 120']}, 
            {quarter: 'Winter 2025', courses: ['CSE 102', 'CSE 103', 'CSE 186']},
          ],
          [
            {quarter: 'Fall 2024', courses: ['CSE 187', 'CSE 114A', 'CSE 115A']}, 
            {quarter: 'Winter 2025', courses: ['CSE 242', 'CSE 144', 'CSE 150']}, 
          ],
          ...
        ]
        */

        // all schedules for paticular index are obtained from detailedPlanners[scheduleIndex]
        const schedules = detailedPlanners[schedulesIndex] as quarterSchedule[][];

        // All snapshots for each quarter of each schedule obtained from detailedSnapshots[scheduleIndex]
        const allSnapshots = detailedSnapshots[schedulesIndex] as Snapshot[][];

        // Loop through each schedule of all schedules
        for (let plannerIndex = 0; plannerIndex < schedules.length; plannerIndex++) {
          // schedule is a quarterSchedule[] type, one array
          const schedule = schedules[plannerIndex] as quarterSchedule[];

          //scheduleSnapshots is an array of snapshots for this schedule
          const scheduleSnapshots = allSnapshots[plannerIndex] as Snapshot[];

          // Get the progress report (snapshot) left off last time
          // i = 1 (2nd quarter in schedule), get scheduleSnapshots[0] (left by 1st quarter in schedule)
          const nextSnapshot = structuredClone(scheduleSnapshots[i - 1]);

          const currentTerm = nextSnapshot.nextTerm;

          nextSnapshot.nextTerm = await incrementQuarter(currentTerm);
          let numCourses = numCoursesPerQuarter[i];
          const addToCourses = [];

          const currQuarter = currentTerm.charAt(0);

          // Logic for Core Course, Writing Courses
          if (currQuarter === 'W' && nextSnapshot.coreCourse === '2') {
            numCourses--;
            addToCourses.push('College Core Course (Part 2)');
            nextSnapshot.coreCourse = '1';
          }
          if (nextSnapshot.writingPlacement === '25' && currQuarter === 'F') {
            numCourses--;
            addToCourses.push('Writing 25');
            nextSnapshot.writingPlacement = '26';
          } else if (nextSnapshot.writingPlacement === '26' && (currQuarter === 'F' || currQuarter === 'W')) {
            numCourses--;
            addToCourses.push('Writing 26');
            nextSnapshot.writingPlacement = '1';
          } else if (nextSnapshot.writingPlacement === '1' && (currQuarter === 'W' || currQuarter === 'S')) {
            numCourses--;
            addToCourses.push('Writing 1/Writing 1E');
            nextSnapshot.writingPlacement = '2';
          } else if (nextSnapshot.writingPlacement === '2' && (currQuarter === 'F' || currQuarter === 'S')) {
            numCourses--;
            addToCourses.push('Writing 2/Writing 2H');
            nextSnapshot.writingPlacement = 'C';
            nextSnapshot.neededGeneralEdCourses = nextSnapshot.neededGeneralEdCourses.filter(ge => ge !== 'C');
          }

          const currentInDegreeObject = await getInDegreeList(nextSnapshot.neededMajorCourses);
          const queue = [];
          for (const course in currentInDegreeObject) {
            if (currentInDegreeObject[course] === 0) {
              queue.push(course);
            }
          }

          const coreCount = await getCoreUpperCoursesCount(nextSnapshot.neededMajorCourses);
          if (queue.includes('CSE195')) {
            const indexToRemove = queue.findIndex(course => course === 'CSE195');
            queue.splice(indexToRemove, 1);
          }
          if (coreCount < 2 && queue.includes('CSE185S')) {
            const indexToRemove = queue.findIndex(course => course === 'CSE185S');
            queue.splice(indexToRemove, 1);
          }

          // Generate the best next quarter schedule

          const date = await getQuarterName(currentTerm);
          const numQuartersLeft = await getNumQuartersBetweenStartAndEndDate(currentTerm, gradDate);

          // Get number of reamining required major courses
          let numMajorCoursesNeeded = nextSnapshot.neededMajorCourses.length;

          // Subtract equivalent courses in the count
          const equivSet: Set<string> = new Set();
          for (const course in equivalencyObj) {
            if (equivSet.has(course)) {
              continue;
            }
            if (nextSnapshot.neededMajorCourses.includes(course)) {
              for (const equivCourse of equivalencyObj[course]) {
                numMajorCoursesNeeded--;
                equivSet.add(equivCourse);
              }
            }
          }

          let numMajorElectivesNeeded = nextSnapshot.neededElectives.length;

          // Add Number of Major Electives/Capstone Electives needed
          numMajorCoursesNeeded += numMajorElectivesNeeded;

          // Get recommended number of major courses to take this quarter based on quarters left in 
          // student's undergrad and number of remaining required major courses
          let numMajorCourses = Math.ceil(numMajorCoursesNeeded / numQuartersLeft);

          // If recommended number of major courses is greater than overall number of course slots open in quarter schedule
          // level the number of major courses to be the same as the number of open course slots left
          numMajorCourses = numMajorCourses > numCourses ? numCourses : numMajorCourses;

          // Final Courses Array to be pushed onto this generated schedule
          const finalCourses = [];

          // Get Next Priority Major Courses
          const getNextPriorityCourses =
            await getTopPriorityCourses(queue, numMajorCourses, priorityObject, catalog);

          let moreCoursesToAdd =
            getNextPriorityCourses.length < numMajorCourses ? numMajorCourses - getNextPriorityCourses.length : 0;

          const numAddPossibleElectives = moreCoursesToAdd;

          for (let j = 0; j < numAddPossibleElectives; j++) {
            if (numMajorElectivesNeeded > 0 && !nextSnapshot.neededMajorCourses.includes('CSE101')) {
              numMajorElectivesNeeded--;
              numMajorCoursesNeeded--;
              moreCoursesToAdd--;
              getNextPriorityCourses.push(nextSnapshot.neededElectives[0]);
              nextSnapshot.neededElectives = nextSnapshot.neededElectives.slice(1);
            }
          }

          // Consider recommending an major elective instead if major requirements (excluding electives) 
          // is less than or equal to major electives needed

          // Example: Student has 7 major courses left, 4 of them are major electives
          // Example: Student has 6 major courses left, 3 of which are major electives
          if (!numAddPossibleElectives &&
            numMajorCoursesNeeded - numMajorElectivesNeeded <= numMajorElectivesNeeded &&
            !nextSnapshot.neededMajorCourses.includes('CSE101') && numMajorElectivesNeeded > 1) {
            getNextPriorityCourses[getNextPriorityCourses.length - 1] = nextSnapshot.neededElectives[0];
            nextSnapshot.neededElectives = nextSnapshot.neededElectives.slice(1);
          }

          finalCourses.push(...getNextPriorityCourses);
          for (let j = 0; j < numCourses - numMajorCourses + (moreCoursesToAdd); j++) {
            if (nextSnapshot.neededGeneralEdCourses.length > 1 ||
              (nextSnapshot.neededGeneralEdCourses.length === 1 && nextSnapshot.neededGeneralEdCourses[0] !== 'C')) {
              finalCourses.push('GE Course')
              const indexToRemove = nextSnapshot.neededGeneralEdCourses.findIndex(ge => ge !== 'C');
              nextSnapshot.neededGeneralEdCourses.splice(indexToRemove, 1)
              continue;
            }
            finalCourses.push('Elective');
          }

          finalCourses.push(...addToCourses);
          schedule.push({ quarter: date, courses: finalCourses });
          for (const course of getNextPriorityCourses) {
            if (course.includes('Elective')) {
              continue;
              // const indexToRemove = nextSnapshot.neededElectives.findIndex(e => e === course);
              // nextSnapshot.neededElectives.splice(indexToRemove, 1);
            } else {
              nextSnapshot.neededMajorCourses = nextSnapshot.neededMajorCourses.filter(c => c !== course)
              if (equivalencyObj[course] !== undefined) {
                for (const equivCourse of equivalencyObj[course]) {
                  nextSnapshot.neededMajorCourses = nextSnapshot.neededMajorCourses.filter(c => c !== equivCourse)
                }
              }
            }
          }
          scheduleSnapshots.push({ ...nextSnapshot });
        }
      }
    }
  }

  if (numQuartersToGenerate === 1) {

    await generateFirstQuarter();

    return detailedPlanners;

  } else if (numQuartersToGenerate <= 3) {

    // Call Function to Fill Next Quarter Schedule: await generateNextQuarter();
    await generateFirstQuarter();

    // Call Function to Fill Out Rest of Planner:  await gaeneratePlanners(numQuartersToGenerate)
    await generatePlanners(numQuartersToGenerate);

    return detailedPlanners;

  } else {

    // Call Function to Fill Next Quarter Schedule: generateNextQuarter(planners);
    await generateFirstQuarter();

    // Call Function to Fill Out Rest of Planner:  await gaeneratePlanners(numQuartersToGenerate)
    await generatePlanners(numQuartersToGenerate);

    return detailedPlanners;


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
*/
