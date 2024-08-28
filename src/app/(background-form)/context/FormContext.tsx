import { PropsWithChildren, useState, createContext, useContext } from "react";


export type InfoData = {
  catalogYear: string,
  major: string,
  gradDate: string,
  planner: string,
}

export type UndergradData = {
  math: string,
  writing: string,
  testout: string[],
}

export type UniversityReq = {
  ahr: boolean,
  entry: boolean,
  coreCourse: string,
}

export type BackgroundCourseData = {
  universityReq: UniversityReq,
  generalEdCourses: string[],
  majorCourses: string[],
}

export const FormContext = createContext({
  infoData: {
    catalogYear: '',
    major: '',
    gradDate: '',
    planner: '',
  },
  setInfoData: (data: InfoData | ((prev: InfoData) => InfoData)) => {},
  studentStatus: '',
  setStudentStatus: (student: string) => {},
  undergradData: {
    math: '',
    writing: '',
    testout: [] as string[],
  },
  setUndergradData: (data: UndergradData | ((prev: UndergradData) => UndergradData)) => {},
  backgroundCourseData: {
    universityReq: {
      ahr: false,
      entry: false,
      coreCourse: '',
    },
    generalEdCourses: [] as string[],
    majorCourses: [] as string[],
  },
  setBackgroundCourseData: (data: BackgroundCourseData | ((prev: BackgroundCourseData) => BackgroundCourseData)) => {},
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
    planner: ''
  });
  const [stepLastCompleted, setStepLastCompleted] = useState(0);
  const [stepError, setStepError] = useState('');
  const [studentStatus, setStudentStatus] = useState('');

  const [undergradData, setUndergradData] = useState<UndergradData>({
    math: '',
    writing: '',
    testout: [],
  })

  const [backgroundCourseData, setBackgroundCourseData] = useState<BackgroundCourseData>({
    universityReq: {
      ahr: false,
      entry: false,
      coreCourse: '',
    },
    generalEdCourses: [],
    majorCourses: [],
  })


  return (
    <FormContext.Provider value = {{
      infoData,
      setInfoData,
      undergradData,
      setUndergradData,
      backgroundCourseData,
      setBackgroundCourseData,
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