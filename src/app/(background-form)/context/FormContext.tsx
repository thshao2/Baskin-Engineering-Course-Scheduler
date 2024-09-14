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
  testout: { [key: string]: boolean },
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

export type NumCoursesPreference = {
  numCoursesPerQuarter: string[],
  numMajorCourses: string[],
}

// Define the full FormContext type
export type FormContextType = {
  infoData: InfoData,
  // setInfoData: (data: InfoData | ((prev: InfoData) => InfoData)) => void,
  studentStatus: string,
  // setStudentStatus: (student: string) => void,
  undergradData: UndergradData,
  // setUndergradData: (data: UndergradData | ((prev: UndergradData) => UndergradData)) => void,
  backgroundCourseData: BackgroundCourseData,
  // setBackgroundCourseData: (data: BackgroundCourseData | ((prev: BackgroundCourseData) => BackgroundCourseData)) => void,
  numCoursesPreference: NumCoursesPreference,
  // setNumCoursesPreference: (data: NumCoursesPreference | ((prev: NumCoursesPreference) => NumCoursesPreference)) => void,
  majorChoices: string[],
  // setMajorChoices: (data: string[] | ((prev: string[]) => string[])) => void,
  // stepLastCompleted: number,
  // setStepLastCompleted: (step: number) => void,
  // stepError: string,
  // setStepError: (error: string) => void
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
    testout: {} as Record<string, boolean>,
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
  numCoursesPreference: {
    numCoursesPerQuarter: [] as string[],
    numMajorCourses: [] as string[],
  },
  majorChoices: [] as string[],
  setMajorChoices: (data: string[] | ((prev: string[]) => string[])) => {},
  setNumCoursesPreference: (data: NumCoursesPreference | ((prev: NumCoursesPreference) => NumCoursesPreference)) => {},
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
    testout: {},
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

  const [numCoursesPreference, setNumCoursesPreference] = useState<NumCoursesPreference>({
    numCoursesPerQuarter: ['3'],
    numMajorCourses: ['2'],
  })

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