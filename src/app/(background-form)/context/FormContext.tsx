import { PropsWithChildren, useState, createContext, useContext } from "react";


export type InfoData = {
  catalogYear: string,
  major: string,
  gradDate: string,
  planner: string,
  startPlanner: string,
}

export type UndergradData = {
  math: string,
  writing: string,
}

export type UniversityReq = {
  ahr: string,
  coreCourse: string,
}

export type BackgroundCourseData = {
  universityReq: UniversityReq,
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
  undergradData: UndergradData,
  backgroundCourseData: BackgroundCourseData,
  numCoursesPreference: string[],
  majorChoices: string[],
}


export const FormContext = createContext({
  infoData: {
    catalogYear: '',
    major: '',
    gradDate: '',
    planner: '',
    startPlanner: '',
  },
  setInfoData: (data: InfoData | ((prev: InfoData) => InfoData)) => {},
  studentStatus: '',
  setStudentStatus: (student: string) => {},
  undergradData: {
    math: '',
    writing: '',
  },
  setUndergradData: (data: UndergradData | ((prev: UndergradData) => UndergradData)) => {},
  backgroundCourseData: {
    universityReq: {
      ahr: '',
      coreCourse: '',
    },
    completedGeneralEdCourses: [] as string[],
    completedMajorCourses: [] as string[],
    completedMajorElectives: [] as string[],
    completedCapstoneElectives: [] as string[],
    completedAlternativeElectives: [] as string[],
  },
  setBackgroundCourseData: (data: BackgroundCourseData | ((prev: BackgroundCourseData) => BackgroundCourseData)) => {},
  numCoursesPreference: [] as string[],
  setNumCoursesPreference: (data: string[] | ((prev: string[]) => string[])) => {},
  majorChoices: [] as string[],
  setMajorChoices: (data: string[] | ((prev: string[]) => string[])) => {},
  stepLastCompleted: 0,
  setStepLastCompleted: (step: number) => {},
  stepError: '',
  setStepError: (error: string) => {},
})


export const FormProvider = ({ children }: PropsWithChildren<{}>) => {
  const [infoData, setInfoData] = useState({
    catalogYear: '',
    major: '',
    gradDate: '',
    planner: '',
    startPlanner: '',
  });
  const [stepLastCompleted, setStepLastCompleted] = useState(0);
  const [stepError, setStepError] = useState('');
  const [studentStatus, setStudentStatus] = useState('');

  const [undergradData, setUndergradData] = useState<UndergradData>({
    math: '',
    writing: '',
  })

  const [backgroundCourseData, setBackgroundCourseData] = useState<BackgroundCourseData>({
    universityReq: {
      ahr: '',
      coreCourse: '',
    },
    completedGeneralEdCourses: [],
    completedMajorCourses: [],
    completedMajorElectives: [],
    completedCapstoneElectives: [],
    completedAlternativeElectives: [],

  })

  const [numCoursesPreference, setNumCoursesPreference] = useState<string[]>(['3'])

  const [majorChoices, setMajorChoices] = useState<string[]>(Array(10).fill(''));

  return (
    <FormContext.Provider value = {{
      infoData,
      setInfoData,
      undergradData,
      setUndergradData,
      backgroundCourseData,
      setBackgroundCourseData,
      numCoursesPreference,
      setNumCoursesPreference,
      majorChoices, 
      setMajorChoices,
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