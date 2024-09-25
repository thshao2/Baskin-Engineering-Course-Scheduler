import 'server-only';

export const q = ['W', 'S', 'F']

export const GE = ['CC', 'ER', 'IM', 'MF', 'SI', 'SR', 'TA', 'PE', 'PR', 'C'] as const;

export const CS_MajorCourses = [
  'MATH3', 'MATH19A', 'MATH19B', 'MATH21', 'MATH23A',
  'CSE12', 'CSE13S', 'CSE16', 'CSE20', 'CSE30', 'CSE40',
  'AM10', 'AM30', 'ECE30', 'STAT131',
  'CSE101', 'CSE101M', 'CSE102', 'CSE103', 'CSE107', 'CSE114A', 'CSE115A', 'CSE120', 'CSE130', 'CSE185S', 'CSE195'
] as const;

export const CS_MajorElectives = [
  'CSE100', 'CSE101M', 'CSE104', 'CSE105', 'CSE108', 'CSE109',
  'CSE110A', 'CSE111', 'CSE113', 'CSE115B', 'CSE117', 'CSE118',
  'CSE122', 'CSE123A', 'CSE123B', 'CSE125', 'CSE132', 'CSE142', 'CSE146',
  'CSE150', 'CSE151', 'CSE164', 'CSE166A', 'CSE180', 'CSE186', 'CSE195'
];

export const CS_CapstoneElectives = [
  'CSE110B', 'CSE115C', 'CSE115D', 'CSE121', 'CSE134', 'CSE138',
  'CSE140', 'CSE143', 'CSE144', 'CSE156', 'CSE157', 'CSE160',
  'CSE163', 'CSE168', 'CSE181', 'CSE183', 'CSE187', 'CMPM172'
];

export const CS_AlternativeElectives = [
  'AM114', 'AM147', 'CMPM120', 'CMPM131', 'CMPM146', 'CMPM163', 'CMPM164', 'CMPM171', 'CMPM172',
  'MATH110', 'MATH115', 'MATH116', 'MATH117', 'MATH118', 'MATH134', 'MATH145', 'MATH148', 'MATH160',
  'MATH161', 'STAT132', 'PHYS5B', 'PHYS5C', 'PHYS6B', 'PHYS6C'
];

export const CSAdjList: Record<string, string[]> = {
  MATH3: ['MATH19A', 'AM10', 'CSE30'],
  MATH19A: ['MATH19B', 'MATH21', 'CSE16'],
  MATH19B: ['MATH23A', 'AM30', 'ECE30', 'CSE40', 'STAT131', 'CSE101'],
  MATH21: ['AM30'],
  MATH23A: ['CSE107'],
  CSE12: ['CSE13S'],
  CSE13S: ['CSE101', 'CSE120'],
  CSE16: ['CSE101', 'CSE107'],
  CSE20: ['CSE30', 'CSE12', 'CSE16'],
  CSE30: ['CSE40', 'CSE101'],
  CSE40: [],
  AM10: ['AM30'],
  AM30: ['CSE107'],
  ECE30: [],
  STAT131: [],
  CSE101: ['CSE101M', 'CSE102', 'CSE103', 'CSE114A', 'CSE130', 'CSE185S', 'CSE195'],
  CSE101M: [],
  CSE102: [],
  CSE103: [],
  CSE107: [],
  CSE114A: [],
  CSE115A: [],
  CSE120: [],
  CSE130: ['CSE115A'],
  CSE185S: [],
  CSE195: [],
}

export const EquivalentCSCourses: Record<string, string[]> = {
  AM10: ['MATH21'],
  MATH21: ['AM10'],
  AM30: ['MATH23A'],
  MATH23A: ['AM30'],
  CSE107: ['STAT131'],
  STAT131: ['CSE107'],
  CSE115A: ['CSE185S', 'CSE195'],
  CSE185S: ['CSE115A', 'CSE195'],
  CSE195: ['CSE115A', 'CSE185S'],
}

export const newEquivalentCSCourses: Record<string, string[]> = {
  AM10: ['MATH21'],
  MATH21: ['AM10'],
  AM30: ['MATH23A'],
  MATH23A: ['AM30'],
  CSE107: ['STAT131'],
  STAT131: ['CSE107'],
  CSE115A: ['CSE185S', 'CSE195'],
  CSE185S: ['CSE115A', 'CSE195'],
  CSE195: ['CSE115A', 'CSE185S'],
  CSE102: ['CSE103'],
  CSE103: ['CSE102'],
}

export async function getQuarterName(key: string) {
  const quarter = key.charAt(0);
  const year = parseInt(key.slice(1), 10) + 2000;
  if (quarter === 'F') {
    return `Fall ${year}`
  } else if (quarter === 'W') {
    return `Winter ${year}`
  } else if (quarter === 'S') {
    return `Spring ${year}`
  }
  return `Summer ${year}`
}

export async function incrementQuarter(key: string) {
  const quarter = key.charAt(0);
  const year = parseInt(key.slice(1), 10);
  if (quarter === 'F') {
    return `W${year + 1}`
  } else if (quarter === 'W') {
    return `S${year}`
  } else {
    return `F${year}`
  }
}

export async function getPriorityList() {
  const priority: Record<string, number> = {};

  async function dfs(course: string) {
    // If we have already calculated the satisfaction count for this course, return it
    if (priority[course] !== undefined) {
      return priority[course];
    }

    // If the course satisfies no other courses, its count is 0
    if (CSAdjList[course].length === 0) {
      priority[course] = 0;
      return 0;
    }

    // Otherwise, the count is 1 (for itself) + the sum of the satisfaction counts of the courses it satisfies
    let count = CSAdjList[course].length; // directly satisfies this many courses
    for (const nextCourse of CSAdjList[course]) {
      const toAdd = await dfs(nextCourse);
      count += toAdd; // add satisfaction counts of the courses it satisfies
    }

    priority[course] = count;
    return count;
  }

  // Compute satisfaction counts for all courses
  for (const course in CSAdjList) {
    await dfs(course);
  }

  // Later on will consider making an "override" priority object that will be used in this function to add
  // satisfaction counts on courses that have too low of a priority
  if (priority['CSE40'] !== undefined) {
    priority['CSE40'] = priority['CSE40'] + 1;
  }

  return priority;
}

export async function sortCoursesByPriority(courses: string[], priorityObj: Record<string, number>) {
  return courses.sort((a, b) => priorityObj[b] - priorityObj[a]);
}

export async function getInDegreeList(neededMajorCourses: string[]) {
  const inDegreeObject: Record<string, number> = neededMajorCourses.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {} as Record<string, number>);

  for (const course in inDegreeObject) {
    for (const nextCourse of CSAdjList[course]) {
      if (inDegreeObject[nextCourse] === undefined) {
        inDegreeObject[nextCourse] = 1;
      } else {
        inDegreeObject[nextCourse]++;
      }
    }
  }

  return inDegreeObject;
}

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

export async function getDifference(array1: readonly string[], array2: string[]) {
  return array1.filter(item => !array2.includes(item));
}

export async function checkCSElectiveRequirements(allCompletedElectives: string[], electiveReq: { [key: string]: boolean }) {
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

export async function getNeededCSElectives(electiveReq: { [key: string]: boolean }) {
  const neededElectives: string[] = [];
  let hasCapstone = electiveReq.capstone;

  if (!electiveReq.elective2) {
    neededElectives.push(hasCapstone ? 'Major Elective' : 'Capstone Elective');
    hasCapstone = true;
  }
  if (!electiveReq.elective1) {
    neededElectives.push(hasCapstone ? 'Major Elective' : 'Capstone Elective (CSE course)');
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

  const capstoneIndex = neededElectives.findIndex(
    (e) => e === 'Capstone Elective' || e === 'Capstone Elective (CSE course)'
  );

  if (capstoneIndex !== -1) {
    // Remove the Capstone Elective from the array
    const [capstoneElective] = neededElectives.splice(capstoneIndex, 1);
    // Add it to the end of the array
    neededElectives.push(capstoneElective);
  }

  return neededElectives;
}

export async function getElectivesToAdd(neededMajorCourses: string[], neededElectives: string[]) {
  const completedMajorCourses = await getDifference(CS_MajorCourses, neededMajorCourses);
  const numNeeded = neededElectives.length;
  if (!completedMajorCourses.includes('CSE101')) {
    return 0;
  }
  const req = ['CSE40', 'CSE101M', 'CSE102', 'CSE103', 'CSE107', 'CSE114A', 'CSE120', 'CSE130'];
  let count = completedMajorCourses.filter(course => req.includes(course)).length;
  if (count < 2) {
    return numNeeded < 1 ? numNeeded : 1
  } else if (count < 4) {
    return numNeeded < 2 ? numNeeded : 2;
  } else if (count < 6) {
    return numNeeded < 3 ? numNeeded : 3;
  } else {
    return numNeeded < 4 ? numNeeded : 4;
  }
}

export async function getCoreUpperCoursesCount(neededMajorCourses: string[]) {
  const completedMajorCourses = await getDifference(CS_MajorCourses, neededMajorCourses);
  if (!completedMajorCourses.includes('CSE101')) {
    return 0;
  }
  const req = ['CSE40', 'CSE101M', 'CSE102', 'CSE103', 'CSE107', 'CSE114A', 'CSE120', 'CSE130'];
  let count = completedMajorCourses.filter(course => req.includes(course)).length;
  return count;
}