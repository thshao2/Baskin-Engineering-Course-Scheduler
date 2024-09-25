import { PropsWithChildren, useState, createContext, useContext } from "react";

export type InfoData = {
  catalogYear: string,
  major: string,
  startDate: string,
  gradDate: string,
  planner: string,
  college: string,
  startPlanner: string,
}

export type BackgroundCourseData = {
  ahr: string,
  writing: string,
  completedGeneralEdCourses: string[],
  completedMajorCourses: string[],
  completedMajorElectives: string[],
  completedCapstoneElectives: string[],
  completedAlternativeElectives: string[],
}

// Define the full FormContext type
export type FormContextType = {
  infoData: InfoData,
  studentStatus: string,
  backgroundCourseData: BackgroundCourseData,
  numCoursesPreference: string[],
}


export const FormContext = createContext({
  infoData: {
    catalogYear: '',
    major: '',
    startDate: '',
    gradDate: '',
    planner: '',
    college: '',
    startPlanner: '',
  },
  setInfoData: (data: InfoData | ((prev: InfoData) => InfoData)) => {},
  studentStatus: '',
  setStudentStatus: (student: string) => {},
  backgroundCourseData: {
    ahr: '',
    writing: '',
    completedGeneralEdCourses: [] as string[],
    completedMajorCourses: [] as string[],
    completedMajorElectives: [] as string[],
    completedCapstoneElectives: [] as string[],
    completedAlternativeElectives: [] as string[],
  },
  setBackgroundCourseData: (data: BackgroundCourseData | ((prev: BackgroundCourseData) => BackgroundCourseData)) => {},
  numCoursesPreference: [] as string[],
  setNumCoursesPreference: (data: string[] | ((prev: string[]) => string[])) => {},
  stepLastCompleted: 0,
  setStepLastCompleted: (step: number) => {},
  stepError: '',
  setStepError: (error: string) => {},
})


export const FormProvider = ({ children }: PropsWithChildren<{}>) => {
  const [infoData, setInfoData] = useState({
    catalogYear: '',
    major: '',
    startDate: '',
    gradDate: '',
    planner: '',
    college: '',
    startPlanner: '',
  });
  
  const [studentStatus, setStudentStatus] = useState('');

  const [backgroundCourseData, setBackgroundCourseData] = useState<BackgroundCourseData>({
    ahr: '',
    writing: '',
    completedGeneralEdCourses: ['MF', 'SI', 'SR'],
    completedMajorCourses: [],
    completedMajorElectives: [],
    completedCapstoneElectives: [],
    completedAlternativeElectives: [],

  })

  const [numCoursesPreference, setNumCoursesPreference] = useState<string[]>(['3'])

  const [stepLastCompleted, setStepLastCompleted] = useState(0);
  const [stepError, setStepError] = useState('');

  return (
    <FormContext.Provider value = {{
      infoData,
      setInfoData,
      backgroundCourseData,
      setBackgroundCourseData,
      numCoursesPreference,
      setNumCoursesPreference,
      stepLastCompleted,
      setStepLastCompleted,
      stepError,
      setStepError,
      studentStatus,
      setStudentStatus,
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