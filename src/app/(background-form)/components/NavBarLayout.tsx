'use client'

import { FormProvider } from "../context/FormContext";
import Stepper from "./Stepper";
import { ReactNode } from 'react';



interface NavBarLayoutProps {
  children: ReactNode;
}

export default function NavBarLayout({children}: NavBarLayoutProps) {
  return (
    <FormProvider>
      <Stepper/>
      {children}
    </FormProvider>
  )
}