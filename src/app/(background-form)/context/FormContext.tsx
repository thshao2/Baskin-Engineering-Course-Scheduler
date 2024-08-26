import { PropsWithChildren, useState, createContext, useContext } from "react";


export const FormContext = createContext({
  catalogYear: '',
  setCatalogYear: (year: string) => { },
  major: '',
  setMajor: (major: string) => { },
  gradDate: '',
  setGradDate: (date: string) => { },
  planner: '',
  setPlanner: (planner: string) => { },
})


export const FormProvider = ({ children }: PropsWithChildren<{}>) => {
  const [catalogYear, setCatalogYear] = useState('');
  const [major, setMajor] = useState('');
  const [gradDate, setGradDate] = useState('');
  const [planner, setPlanner] = useState('');

  return (
    <FormContext.Provider value = {{
      catalogYear,
      setCatalogYear,
      major,
      setMajor,
      gradDate,
      setGradDate,
      planner,
      setPlanner,
    }}>
      {children}
    </FormContext.Provider>  
  )
}

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context;
}