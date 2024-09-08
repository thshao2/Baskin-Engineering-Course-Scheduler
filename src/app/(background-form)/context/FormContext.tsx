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
  entry: boolean,
  coreCourse: string,
}

export type BackgroundCourseData = {
  universityReq: UniversityReq,
  completedGeneralEdCourses: string[],
  completedMajorCourses: string[],
}

export type NumCoursesPreference = {
  numCoursesPerQuarter: string[],
  numMajorCourses: string[],
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
      entry: false,
      coreCourse: '',
    },
    completedGeneralEdCourses: [] as string[],
    completedMajorCourses: [] as string[],
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
      entry: false,
      coreCourse: '',
    },
    completedGeneralEdCourses: [],
    completedMajorCourses: [],
  })

  const [numCoursesPreference, setNumCoursesPreference] = useState<NumCoursesPreference>({
    numCoursesPerQuarter: ['3'],
    numMajorCourses: ['2'],
  })

  const [majorChoices, setMajorChoices] = useState<string[]>([]);

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