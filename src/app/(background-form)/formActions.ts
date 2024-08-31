'use server'

import { InfoData } from "./context/FormContext";
import { BackgroundCourseData, UndergradData } from "./context/FormContext";

import { z } from 'zod';

export async function validateInfoForm(infoForm: InfoData) {
  const date = new Date();
  const curMonth = date.getMonth();
  let toCatalog = curMonth > 6 ? date.getFullYear() % 1000 : (date.getFullYear() - 1) % 1000;
  let startGradDate;
  let endGradDate;

  if (curMonth > 9) {
    startGradDate = (date.getFullYear() + 1) % 1000;
  } else {
    startGradDate = date.getFullYear() % 1000;
  }
  endGradDate = startGradDate + 5;


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
      .min(1, {message: 'Expected Graduation Date is Required'}) // Ensure it isn't empty
      .refine(val => /^[FWS]\d{2}$/.test(val), {message: 'Invalid Input. Error: Expected Graduation Date'})
      .refine(val => {
        const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
        return year >= startGradDate && year <= endGradDate;
      }, { message: 'Invalid Input. Error: Expected Graduation Date' }),
    Planner: z.string()
      .refine(val => val === '1' || val === '2', {
        message: 'Invalid Input. Error: Type of Planner',
      }),
  });

  const result = schema.safeParse({
    CatalogYear: infoForm.catalogYear,
    Major: infoForm.major,
    GradDate: infoForm.gradDate,
    Planner: infoForm.planner,
  })

  if (!result.success) {
    const errorMessages = result.error.errors.map(error => error.message);
    return {success: false, errors: errorMessages};
  }

  return {success: true};

}

export async function validateBackgroundCourseForm(studentStatus: string, undergradData: UndergradData, backgroundCourseData: BackgroundCourseData) {
  
  // Validate student status first
  const StudentStatusSchema = z.enum(['U', 'C', 'T'], { message: 'Invalid Student Status' });

  const statusValidation = StudentStatusSchema.safeParse(studentStatus);

  if (!statusValidation.success) {
    return { success: false, errors: [statusValidation.error.message] };
  }

  let coreCourseSchema = z.string();

  // Fix Regex for coreCourse

  if (studentStatus !== 'T') {
      coreCourseSchema = z.string()
        .min(1, {message: studentStatus === 'U' ? 'College Core Course is Required' : 'Please indicate whether you have completed your College Core Course'})
        .regex(/^[A-Z12]$/, {
        message: "Invalid Input. Error: College Core Course",
      })
  }

  const UniversityReqSchema = z.object({
    ahr: z.enum(['T', 'F'], {message: 'Please indicate whether you have completed the AHR Requirement'}),
    entry: z.boolean(),
    coreCourse: coreCourseSchema,
  });

  const BackgroundCourseDataSchema = z.object({
    universityReq: UniversityReqSchema,
    completedGeneralEdCourses: z.array(z.string().regex(/^[A-Z]{2}|C$/, {
      message: "Invalid Input. Error: General Education Courses",
    })),
    completedMajorCourses: z.array(z.string().regex(/^[A-Z]{2,4}\d{2,3}[A-Z]?$/, {
      message: "Invalid Input. Error: Completed Major Courses",
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
    return {success: false, errors: errorMessages};  
  }

  let mathSchema = z.string();
  let writingSchema = z.string();
  let testoutSchema;

  if (!backgroundCourseData.completedGeneralEdCourses.includes('C')) {
    writingSchema = z.string()
        .min(1, {message: "Writing Placement is Required"})
        .regex(/^\d{1,2}$/, {
        message: "Invalid Input. Error: Writing Placement"
      })
  }

  if (studentStatus === 'U') {
    mathSchema = z.string()
      .min(1, {message: 'Math Placement is Required'}) // Ensure it isn't empty
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
    return {success: false, errors: errorMessages};
  }

  return {success: true};
}