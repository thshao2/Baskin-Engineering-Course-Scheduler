'use server'

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

export async function validateInfoForm(infoForm: InfoData) {
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

  // if (curMonth > 9) {
  //   startPlannerRegex = /^[WS]\d{2}$/;
  //   yearStartPlan = curYear + 1;
  //   yearEndStartPlan = curYear + 1;
  // } else if (curMonth > 3) {
  //   startPlannerRegex = /^[FW]\d{2}$/;
  //   yearEndStartPlan = curYear + 1;
  // } else if (curMonth > 1) {
  //   startPlannerRegex = /^[SF]\d{2}$/;
  // } else if (curMonth > 0) {
  //   startPlannerRegex = /^S\d{2}$/;
  // } else {
  //   startPlannerRegex = /^[WS]\d{2}$/;
  // }


  const schema = z.object({
    CatalogYear: z.string()
      .regex(/^\d{2}$/, 'Invalid Catalog Year')
      .refine(val => parseInt(val, 10) >= 22 && parseInt(val, 10) <= toCatalog, {
        message: 'Invalid Catalog Year',
      }),
    Major: z.string()
      .min(2, 'Invalid Input. Error: Major Selection')
      .max(4, 'Invalid Input. Error: Major Selection'),
    GradDate: z.string()
      .min(1, { message: 'Expected Graduation Date is Required' }) // Ensure it isn't empty
      .refine(val => /^[FWS]\d{2}$/.test(val), { message: 'Invalid Input. Error: Expected Graduation Date' })
      .refine(val => {
        const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
        return year >= startGradDate && year <= endGradDate;
      }, { message: 'Invalid Input. Error: Expected Graduation Date' }),
    Planner: z.string()
      .refine(val => val === '1' || val === '2', {
        message: 'Invalid Input. Error: Type of Planner',
      }),
    StartPlanner: z.string()
      .min(1, { message: 'Planner Start Date is Required' }) // Ensure it isn't empty
      .refine(val => startPlannerRegex.test(val), { message: 'Invalid Input. Error: Planner Start Date' })
      .refine(val => {
        const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
        return year >= yearStartPlan && year <= yearEndStartPlan;
      }, { message: 'Invalid Input. Error: Planner Start Date' }),
  });

  const result = schema.safeParse({
    CatalogYear: infoForm.catalogYear,
    Major: infoForm.major,
    GradDate: infoForm.gradDate,
    Planner: infoForm.planner,
    StartPlanner: infoForm.startPlanner,
  })

  if (!result.success) {
    const errorMessages = result.error.errors.map(error => error.message);
    return { success: false, errors: errorMessages };
  }

  const checkValidStart = await checkStartEndPlan(infoForm.startPlanner, infoForm.gradDate);

  if (!checkValidStart) {
    return { success: false, errors: ['Planner Start Date must be on or before Expected Graduation Date'] };
  }

  return { success: true };

}

export async function validateBackgroundCourseForm(studentStatus: string, undergradData: UndergradData, backgroundCourseData: BackgroundCourseData) {

  // Validate student status first
  const StudentStatusSchema = z.enum(['U', 'C', 'T'], { message: 'Invalid Student Status' });

  const statusValidation = StudentStatusSchema.safeParse(studentStatus);

  if (!statusValidation.success) {
    return { success: false, errors: [statusValidation.error.message] };
  }

  let coreCourseSchema = z.string();

  if (studentStatus === 'U') {
    coreCourseSchema = z.string()
      .min(1, { message: 'College Core Course is Required' })
      .regex(/^[CSTMPKORNJ]$/, {
        message: "Invalid Input. Error: College Core Course is Required",
      })
  } else if (studentStatus === 'C') {
    coreCourseSchema = z.string()
      .min(1, { message: 'Please indicate whether you have completed your College Core Course' })
      .regex(/^[12]$/, {
        message: "Invalid Input. Error: Please indicate whether you have completed your College Core Course",
      })
  }

  const UniversityReqSchema = z.object({
    ahr: z.enum(['T', 'F'], { message: 'Please indicate whether you have completed the AHR Requirement' }),
    entry: z.boolean(),
    coreCourse: coreCourseSchema,
  });

  const BackgroundCourseDataSchema = z.object({
    universityReq: UniversityReqSchema,
    completedGeneralEdCourses: z.array(z.string().regex(/^[A-Z]{2}|C$/, {
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
  let testoutSchema;

  if (!backgroundCourseData.completedGeneralEdCourses.includes('C')) {
    writingSchema = z.string()
      .min(1, { message: "Writing Placement is Required" })
      .regex(/^\d{1,2}$/, {
        message: "Invalid Input. Error: Writing Placement"
      })
  }

  if (studentStatus === 'U') {
    mathSchema = z.string()
      .min(1, { message: 'Math Placement is Required' }) // Ensure it isn't empty
      .regex(/^\d{1,2}([AB])?$/, {
        message: "Invalid Input. Error: Math Placement"
      })
    testoutSchema = z.object({
      'CSE20': z.boolean().optional(), // 'CSE20' is expected but marked optional for initial presence check
    }).refine((data) => data.hasOwnProperty('CSE20'), {
      message: 'Please indicate whether you have or plan to take the CSE 20 testout exam',
    });
  } else {
    testoutSchema = z.record(z.boolean())
  }

  const UndergradDataSchema = z.object({
    math: mathSchema,
    writing: writingSchema,
    testout: testoutSchema,
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

  return { success: true };
}

export async function validateStudentPreferencesForm(infoData: InfoData, arrNumCourses: string[]) {
  let numQuarters = 0;
  const checkInfoData = await validateInfoForm(infoData);
  if (!checkInfoData.success) {
    // throw new Error(checkInfoData.errors ? checkInfoData.errors[0] : 'Something went wrong. Please restart the form and try again.')
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

export async function validateEntireForm(formContext: FormContextType) {
  
}