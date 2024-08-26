import { PropsWithChildren, useState, createContext, useContext } from "react";


export type InfoData = {
  catalogYear: string,
  major: string,
  gradDate: string,
  planner: string,
}

export const FormContext = createContext({
  infoData: {
    catalogYear: '',
    major: '',
    gradDate: '',
    planner: '',
  },
  setInfoData: (data: InfoData | ((prev: InfoData) => InfoData)) => {},
  stepLastCompleted: 0,
  setStepLastCompleted: (step: number) => {}
})


export const FormProvider = ({ children }: PropsWithChildren<{}>) => {
  const [infoData, setInfoData] = useState({
    catalogYear: '',
    major: '',
    gradDate: '',
    planner: ''
  });
  const [stepLastCompleted, setStepLastCompleted] = useState(0);


  // const [catalogYear, setCatalogYear] = useState('');
  // const [major, setMajor] = useState('');
  // const [gradDate, setGradDate] = useState('');
  // const [planner, setPlanner] = useState('');

  return (
    <FormContext.Provider value = {{
      infoData,
      setInfoData,
      stepLastCompleted,
      setStepLastCompleted
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