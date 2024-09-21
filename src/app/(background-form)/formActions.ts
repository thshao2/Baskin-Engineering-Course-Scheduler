'use server'

import getPlanners from "../lib/get-planners";
import { getNumQuartersBetweenStartAndEndDate } from "../lib/helper";
import { FormContextType, InfoData } from "./context/FormContext";
import { BackgroundCourseData, UndergradData } from "./context/FormContext";

import { z } from 'zod';

const q = ['W', 'S', 'F'];

async function checkStartEndPlan(start: string, end: string) {
  const startPlannerYear = parseInt(start.slice(1), 10);
  const gradDateYear = parseInt(end.slice(1), 10);

  if (startPlannerYear === gradDateYear) {
    const startPlannerQuarter = start.charAt(0);
    const endPlannerQuarter = end.charAt(0);
    return q.indexOf(startPlannerQuarter) <= q.indexOf(endPlannerQuarter);

  } else {
    return startPlannerYear < gradDateYear;
  }
}

export async function validateInfoForm(infoForm: InfoData, status: string) {
  // Validate student status first
  const StudentStatusSchema = z.enum(['U', 'C', 'T', 'CT'], { message: 'Error: Invalid Student Status' });

  const statusValidation = StudentStatusSchema.safeParse(status);

  if (!statusValidation.success) {
    return { success: false, errors: [statusValidation.error.message] };
  }

  // Logic for Start and End Graduation Dates Schema
  const date = new Date();
  const curMonth = date.getMonth();
  const curYear = date.getFullYear() % 1000;
  let toCatalog = curMonth > 6 ? date.getFullYear() % 1000 : (date.getFullYear() - 1) % 1000;
  let startGradDate;
  let endGradDate;

  if (curMonth > 9) {
    startGradDate = curYear + 1;
  } else {
    startGradDate = curYear;
  }
  endGradDate = curYear + 5;

  let startPlannerRegex;
  let yearStartPlan = curYear;
  let yearEndStartPlan = curYear;
  let possibleLetters;

  // Logic for Start Planner Date Schema (only for continuing students)
  if (curMonth > 9) {
    possibleLetters = 'WS';
    yearStartPlan = curYear + 1;
    yearEndStartPlan = curYear + 1;
  } else if (curMonth > 3) {
    possibleLetters = 'FW';
    yearEndStartPlan = curYear + 1;
  } else if (curMonth > 1) {
    possibleLetters = 'SF';
  } else if (curMonth > 0) {
    possibleLetters = 'S';
  } else {
    possibleLetters = 'WS';
  }

  startPlannerRegex = new RegExp(`^[${possibleLetters}]\\d{2}$`)

  // Logic for Start Term Schema
  let startTermRange;
  let endTermRange = curYear;
  if (!status.includes('C')) {
    startTermRange = curYear;
    endTermRange++;
  } else if (status === 'CT') {
    startTermRange = curYear - 3;
  } else {
    startTermRange = curYear - 5;
  }

  const startTermSchema = z.string()
    .min(1, { message: 'Start Term is Required' }) // Ensure it isn't empty
    .regex(/^[FW]\d{2}$/, { message: 'Invalid Input. Error: Start Term' })
    .refine(val => {
      const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
      return year >= startTermRange && year <= endTermRange;
    }, { message: 'Invalid Input. Error: Start Term' })

  const startPlannerSchema = (!status.includes('C'))
    ? z.string() // Any string is allowed for 'U' or 'T' status
    : z.string()
      .min(1, { message: 'Planner Start Date is Required' }) // Ensure it isn't empty
      .refine(val => startPlannerRegex.test(val), { message: 'Invalid Input. Error: Planner Start Date' })
      .refine(val => {
        const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
        return year >= yearStartPlan && year <= yearEndStartPlan;
      }, { message: 'Invalid Input. Error: Planner Start Date' });

  let coreCourseSchema = z.string();

  if (status !== 'T') {
    coreCourseSchema = z.string()
      .min(1, { message: 'College Affiliation is Required' })
      .regex(/^[CSTMPKORNJ]$/, {
        message: "Invalid Input. Error: College Affiliation",
      })
  }

  const schema = z.object({
    CatalogYear: z.string()
      .regex(/^\d{2}$/, 'Invalid Catalog Year')
      .refine(val => parseInt(val, 10) >= 22 && parseInt(val, 10) <= toCatalog, {
        message: 'Invalid Catalog Year',
      }),
    Major: z.string()
      .min(2, 'Invalid Input. Error: Major Selection')
      .max(4, 'Invalid Input. Error: Major Selection'),
    StartDate: startTermSchema,
    GradDate: z.string()
      .min(1, 'Expected Graduation Date is Required') // Ensure it isn't empty
      .refine(val => /^[FWS]\d{2}$/.test(val), { message: 'Invalid Input. Error: Expected Graduation Date' })
      .refine(val => {
        const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
        return year >= startGradDate && year <= endGradDate;
      }, { message: 'Invalid Input. Error: Expected Graduation Date' }),
    Planner: z.string()
      .refine(val => val === '1' || val === '2' || val === '3', {
        message: 'Invalid Input. Error: Type of Planner',
      }),
    CollegeAffiliation: coreCourseSchema,
    StartPlanner: startPlannerSchema,
  });

  const result = schema.safeParse({
    CatalogYear: infoForm.catalogYear,
    Major: infoForm.major,
    StartDate: infoForm.startDate,
    GradDate: infoForm.gradDate,
    Planner: infoForm.planner,
    CollegeAffiliation: infoForm.college,
    StartPlanner: infoForm.startPlanner,
  })

  if (!result.success) {
    const errorMessages = result.error.errors.map(error => error.message);
    return { success: false, errors: errorMessages };
  }

  const checkValidStart = await checkStartEndPlan(infoForm.startDate, infoForm.gradDate);

  if (!checkValidStart) {
    return { success: false, errors: ['Invalid Input: Start Term is after Expected Graduation Date'] };
  }

  const checkReasonableGap = await getNumQuartersBetweenStartAndEndDate(infoForm.startDate, infoForm.gradDate);

  if (checkReasonableGap < 3) {
    return { success: false, errors: ['Invalid Input: Start Term cannot be too close to Expected Graduation Date'] };
  }

  if (status.includes('C')) {
    const checkValidStart2 = await checkStartEndPlan(infoForm.startPlanner, infoForm.gradDate);

    if (!checkValidStart2) {
      return { success: false, errors: ['Planner Start Date must be on or before Expected Graduation Date'] };
    }

    const checkValidStart3 = await checkStartEndPlan(infoForm.startDate, infoForm.startPlanner);
    if (!checkValidStart3) {
      return { success: false, errors: ['Start Term must be on or before Planner Start Date'] };
    }
  }

  return { success: true, errors: [] };

}

export async function validateBackgroundCourseForm(studentStatus: string, undergradData: UndergradData, backgroundCourseData: BackgroundCourseData) {

  // Validate student status first
  const StudentStatusSchema = z.enum(['U', 'C', 'T', 'CT'], { message: 'Error: Invalid Student Status' });

  const statusValidation = StudentStatusSchema.safeParse(studentStatus);

  if (!statusValidation.success) {
    return { success: false, errors: [statusValidation.error.message] };
  }

  const BackgroundCourseDataSchema = z.object({
    ahr: z.enum(['T', 'F'], { message: 'Please indicate whether you have completed the AHR Requirement' }),
    completedGeneralEdCourses: z.array(z.string().regex(/^(CC|ER|IM|MF|SI|SR|TA|PE|PR|C)$/, {
      message: "Invalid Input. Error: General Education Courses",
    })),
    completedMajorCourses: z.array(z.string().regex(/^[A-Z]{2,4}\d{1,3}[A-Z]?$/, {
      message: "Invalid Input. Error: Completed Major Courses",
    })),
    completedMajorElectives: z.array(z.string().regex(/^[A-Z]{2,4}\d{3}[A-Z]?$/, {
      message: "Invalid Input. Error: Completed Major Elective Courses",
    })),
    completedCapstoneElectives: z.array(z.string().regex(/^[A-Z]{2,4}\d{3}[A-Z]?$/, {
      message: "Invalid Input. Error: Completed Capstone Courses",
    })),
    completedAlternativeElectives: z.array(z.string().regex(/^[A-Z]{2,4}\d{1,3}[A-Z]?$/, {
      message: "Invalid Input. Error: Completed Alternative Elective Courses",
    })),
  });

  const validateCoursesSchema = z.object({
    backgroundCourseData: BackgroundCourseDataSchema,
  });

  const courseValidation = validateCoursesSchema.safeParse({
    backgroundCourseData: backgroundCourseData,
  })

  if (!courseValidation.success) {
    const errorMessages = courseValidation.error.errors.map(error => error.message);
    return { success: false, errors: errorMessages };
  }

  let mathSchema = z.string();
  let writingSchema = z.string();

  if (!backgroundCourseData.completedGeneralEdCourses.includes('C')) {
    writingSchema = z.string()
      .min(1, { message: "Writing Placement is Required" })
      .regex(/^(25|26|1|2)$/, {
        message: "Invalid Input. Error: Writing Placement"
      })
  }

  if (studentStatus === 'U') {
    mathSchema = z.string()
      .min(1, { message: 'Math Placement is Required' }) // Ensure it isn't empty
      .regex(/^(3|19A|19B|20)$/, {
        message: "Invalid Input. Error: Math Placement"
      })
  }

  const UndergradDataSchema = z.object({
    math: mathSchema,
    writing: writingSchema,
  });

  const validateBackgroundCourseFormSchema = z.object({
    undergradData: UndergradDataSchema,
  });

  const result = validateBackgroundCourseFormSchema.safeParse({
    undergradData: undergradData,
  })

  if (!result.success) {
    const errorMessages = result.error.errors.map(error => error.message);
    return { success: false, errors: errorMessages };
  }

  return { success: true, errors: [] };
}

export async function validateStudentPreferencesForm(infoData: InfoData, arrNumCourses: string[], status: string) {
  let numQuarters = 0;
  const checkInfoData = await validateInfoForm(infoData, status);
  if (!checkInfoData.success) {
    return { success: false, errors: checkInfoData.errors };
  }

  let exactLength = 3;

  if (infoData.planner !== '1') {
    let start = infoData.startPlanner.charAt(0);
    let startYear = parseInt(infoData.startPlanner.slice(1), 10);
    const end = infoData.gradDate.charAt(0);
    const endYear = parseInt(infoData.gradDate.slice(1), 10);

    while (start != end) {
      numQuarters++;
      if (q.indexOf(start) === 2) {
        startYear++;
      }
      start = q[(q.indexOf(start) + 1) % 3];
    }

    if (startYear !== endYear) {
      numQuarters += (((endYear - startYear) * 3) + 1)
    } else {
      numQuarters++;
    }

    exactLength = numQuarters;
  }

  const defaultNumCourseSchema = z.array(z.string()).length(1, { message: 'Invalid Input. Error: Number of Courses Per Quarter' })
    .refine(arr => ['3', '4', '5'].includes(arr[0]), { message: 'Invalid Input. Error: Number of Courses Per Quarter' });

  const advancedNumCourseShema = z.array(z.string()).length(exactLength, { message: 'Invalid Input. Error: Number of Courses Per Quarter' })
    .refine(arr => arr.every(val => ['2', '3', '4', '5'].includes(val)), { message: 'Invalid Input. Error: Number of Courses Per Quarter' });


  const numCoursesPerQuarterSchema = z.union([
    defaultNumCourseSchema,
    advancedNumCourseShema,
  ]);

  const studentPreferencesFormSchema = z.object({
    numCoursesPerQuarter: numCoursesPerQuarterSchema,
  })

  const result = studentPreferencesFormSchema.safeParse({
    numCoursesPerQuarter: arrNumCourses,
  });

  if (!result.success) {
    const errorMessages = result.error.errors.map(error => error.message);
    return { success: false, errors: errorMessages };
  }

  return { success: true };
}

async function validateEntireForm(formContext: FormContextType) {
  let errors = [];
  let result;
  const studentStatus: string = formContext.studentStatus;
  const infoData: InfoData = formContext.infoData;
  const numCoursesPreference: string[] = formContext.numCoursesPreference;
  result = await validateStudentPreferencesForm(infoData, numCoursesPreference, studentStatus);
  if (!result.success) {
    if (result.errors) {
      errors.push(...result.errors)
    }
  }
  const undergradData: UndergradData = formContext.undergradData;
  const backgroundCourseData: BackgroundCourseData = formContext.backgroundCourseData;
  result = await validateBackgroundCourseForm(studentStatus, undergradData, backgroundCourseData);
  if (!result.success) {
    if (result.errors) {
      errors.push(...result.errors)
    }
  }
  if (errors.length > 0) {
    return { success: false, errors: errors }
  }

  return { success: true, errors: [] };

}

export async function validateAndGeneratePlanners(
  infoData: InfoData, studentStatus: string,
  undergradData: UndergradData, backgroundCourseData: BackgroundCourseData,
  numCoursesPreference: string[]) {

  const formContext = {
    infoData: infoData,
    studentStatus: studentStatus,
    undergradData: undergradData,
    backgroundCourseData: backgroundCourseData,
    numCoursesPreference: numCoursesPreference,
  }

  const result = await validateEntireForm(formContext);
  if (result.success) {
    // Generate Schedules
    const planners = await getPlanners(formContext)
    return { ...result, data: planners };
  } else {
    return { ...result, data: [] };
  }
}