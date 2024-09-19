import { newEquivalentCSCourses, EquivalentCSCourses } from "./helper";



export async function generateCoursesForQuarter(courses: string[], x: number, catalog: number): Promise<string[][]> {
  const result: Set<string> = new Set();

  function equivalentCourse(currentCombo: string[], course: string): boolean {
    // Get Equivalency Courses for Catalog Year
    const equivalencyObj = catalog > 23 ? newEquivalentCSCourses : EquivalentCSCourses;

    // Check if any equivalent course is already in currentCombo
    const equivalents = equivalencyObj[course] || []; // Get equivalent courses for the current course
    return currentCombo.some(c => equivalents.includes(c));
  }

  async function generateCombination(start: number, currentCombo: string[]) {
    // If the combination is of size x, add it to the result
    if (currentCombo.length === x) {
      const sortedCombo: string[] = [...currentCombo].sort()
      result.add(JSON.stringify(sortedCombo));
      return;
    }

    // Generate combinations
    for (let i = start; i < courses.length; i++) {
      const course = courses[i];

      if (!equivalentCourse(currentCombo, course)) {
        currentCombo.push(courses[i]);
        await generateCombination(i + 1, currentCombo);
        currentCombo.pop(); // Backtrack to try another combination
      }
    }
  }

  await generateCombination(0, []);
  // Convert the set of strings back to an array of arrays
  return Array.from(result).map(item => JSON.parse(item));
}

// Utility function to shuffle an array (Fisher-Yates Shuffle)
async function shuffleArray(array: string[]): Promise<string[]> {
  const shuffled = array.slice(); // Create a copy of the array to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements randomly
  }
  return shuffled;
}

export async function getTopPriorityCourses(courses: string[], x: number, priorityObj: Record<string, number>, catalog: number): Promise<string[]> {
  // Get Equivalency Courses for Catalog Year
  const equivalencyObj = catalog > 23 ? newEquivalentCSCourses : EquivalentCSCourses;
  const equivalencySet: Set<string> = new Set();
  
  if (courses.length <= x) {
    // Shuffle array for randomness, then remove equivalent courses from the array
    const newCourses = await shuffleArray(courses);
    for (let i = 0; i < newCourses.length; i++) {
      if (equivalencySet.has(newCourses[i])) {
        newCourses.splice(i, 1);
        continue;
      }
      const equivalents: string[] = equivalencyObj[newCourses[i]] || []; // Get equivalent courses for the current course
      equivalents.forEach(course => equivalencySet.add(course));
    }
    return newCourses;
  }

  // Group courses by their priority
  const groupedByPriority: Record<number, string[]> = {};

  courses.forEach((course) => {
    const priority = priorityObj[course];
    if (!groupedByPriority[priority]) {
      groupedByPriority[priority] = [];
    }
    groupedByPriority[priority].push(course);
  });

  // Sort priorities in descending order
  const sortedPriorities = Object.keys(groupedByPriority)
    .map(Number)
    .sort((a, b) => b - a);

  const result: string[] = [];

  for (const priority of sortedPriorities) {
    const coursesWithSamePriority = groupedByPriority[priority];

    if (coursesWithSamePriority.length > 1) {
      // Shuffle courses with the same priority to introduce randomness
      const shuffledCourses = await shuffleArray(coursesWithSamePriority);
      for (const course of shuffledCourses) {
        if (equivalencySet.has(course)) {
          continue;
        }
        result.push(course);
        const equivalents: string[] = equivalencyObj[course] || []; // Get equivalent courses for the current course
        equivalents.forEach(course => equivalencySet.add(course));
        if (result.length === x) {
          return result; // If we have enough courses, return the result
        }
      }
    } else {
      if (equivalencySet.has(coursesWithSamePriority[0])) {
        continue;
      }
      // If only one course has this priority, just add it
      result.push(...coursesWithSamePriority);
      const equivalents: string[] = equivalencyObj[coursesWithSamePriority[0]] || []; // Get equivalent courses for the current course
      equivalents.forEach(course => equivalencySet.add(course));
      if (result.length === x) {
        return result; // If we have enough courses, return the result
      }
    }
  }

  return result;
}
