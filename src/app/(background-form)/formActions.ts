'use server'

import { InfoData } from "./context/FormContext";

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
      .min(2, 'Invalid Input for Major')
      .max(4, 'Invalid Input for Major'),
    GradDate: z.string()
      .min(1, {message: 'Expected Graduation Date is Required'}) // Ensure it isn't empty
      .refine(val => /^[FWS]\d{2}$/.test(val), {message: 'Invalid Input for Expected Graduation Date'})
      .refine(val => {
        const year = parseInt(val.slice(1), 10); // Extract the two digits after the first letter
        return year >= startGradDate && year <= endGradDate;
      }, { message: 'Invalid Input for Expected Graduation Date' }),
    Planner: z.string()
      .refine(val => val === '1' || val === '2', {
        message: 'Invalid Planner Input',
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