import { useFormContext } from "../../../context/FormContext";

import { Typography } from "@mui/material";
import CheckboxResponsive from "../../inputs/CheckboxResponsive";

import { BackgroundCourseData } from "../../../context/FormContext";
import React from "react";
import MultipleAutocomplete from "../../inputs/MultipleAutocomplete";

import SubtitleLink from "../../inputs/SubtitleLink";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const codes = [
  'CSE100', 'CSE101M', 'CSE104', 'CSE105', 'CSE108', 'CSE109',
  'CSE110A', 'CSE111', 'CSE113', 'CSE115B', 'CSE117', 'CSE118',
  'CSE122', 'CSE123A', 'CSE123B', 'CSE125', 'CSE132', 'CSE142', 'CSE146',
  'CSE150', 'CSE151', 'CSE164', 'CSE166A', 'CSE180', 'CSE186', 'CSE195'
] as const;

const majorLabels = [
  'CSE 100/CSE 100L: Logic Design/Logic Design Laboratory',
  'CSE 101M: Mathmatical Thinking for Computer Science (ONLY an elective for 2022-2023 catalog)',
  'CSE 104: Computability and Computational Complexity',
  'CSE 105: Modern Algorithmic Toolbox',
  'CSE 108: Algorithmic Foundations of Cryptography',
  'CSE 109: Quantum Computing',
  'CSE 110A: Fundamentals of Compiler Design I',
  'CSE 111: Advanced Programming',
  'CSE 113: Parallel Programming',
  'CSE 115B: Software Design Project',
  'CSE 117: Open Source Programming',
  'CSE 118: Mobile Applications',
  'CSE 122: Introduction to VLSI Digital System Design',
  'CSE 123A: Engineering Design Project I',
  'CSE 123B: Engineering Design Project II',
  'CSE 125: Logic Design with Verilog',
  'CSE 132: Computer Security',
  'CSE 142: Machine Learning and Data Mining',
  'CSE 146: Ethics & Algorithms',
  'CSE 150: Introduction to Computer Networks',
  'CSE 151/CSE 151L: Advanced Computer Networks / Advanced Computer Networks Laboratory',
  'CSE 164: Computer Vision',
  'CSE 166A: Game Theory and Applications I',
  'CSE 180: Database Systems I',
  'CSE 186: Full Stack Web Development I',
  'CSE 195: Senior Thesis Research (ONLY if not used for DC Requirement)'
] as const;

const CSMajorElectives = [
  { option: 'CSE 100/CSE 100L: Logic Design/Logic Design Laboratory', value: 'CSE100' },
  { option: 'CSE 101M: Mathmatical Thinking for Computer Science (ONLY an elective for 2022-2023 catalog)', value: 'CSE101M' },
  { option: 'CSE 104: Computability and Computational Complexity', value: 'CSE104' },
  { option: 'CSE 105: Modern Algorithmic Toolbox', value: 'CSE105' },
  { option: 'CSE 108: Algorithmic Foundations of Cryptography', value: 'CSE108' },
  { option: 'CSE 109: Quantum Computing', value: 'CSE109' },
  { option: 'CSE 110A: Fundamentals of Compiler Design I', value: 'CSE110A' },
  { option: 'CSE 111: Advanced Programming', value: 'CSE111' },
  { option: 'CSE 113: Parallel Programming', value: 'CSE113' },
  { option: 'CSE 115B: Software Design Project', value: 'CSE115B' },
  { option: 'CSE 117: Open Source Programming', value: 'CSE117' },
  { option: 'CSE 118: Mobile Applications', value: 'CSE118' },
  { option: 'CSE 122: Introduction to VLSI Digital System Design', value: 'CSE122' },
  { option: 'CSE 123A: Engineering Design Project I', value: 'CSE123A' },
  { option: 'CSE 123B: Engineering Design Project II', value: 'CSE123B' },
  { option: 'CSE 125: Logic Design with Verilog', value: 'CSE125' },
  { option: 'CSE 132: Computer Security', value: 'CSE132' },
  { option: 'CSE 142: Machine Learning and Data Mining', value: 'CSE142' },
  { option: 'CSE 146: Ethics & Algorithms', value: 'CSE146' },
  { option: 'CSE 150: Introduction to Computer Networks', value: 'CSE150' },
  { option: 'CSE 151/CSE 151L: Advanced Computer Networks / Advanced Computer Networks Laboratory', value: 'CSE151' },
  { option: 'CSE 164: Computer Vision', value: 'CSE164' },
  { option: 'CSE 166A: Game Theory and Applications I', value: 'CSE166A' },
  { option: 'CSE 180: Database Systems I', value: 'CSE180' },
  { option: 'CSE 186: Full Stack Web Development I', value: 'CSE186' },
];


const capstoneCodes = [
  'CSE110B', 'CSE115C', 'CSE115D', 'CSE121', 'CSE134', 'CSE138',
  'CSE140', 'CSE143', 'CSE144', 'CSE156', 'CSE157', 'CSE160',
  'CSE163', 'CSE168', 'CSE181', 'CSE183', 'CSE187', 'CMPM172'
] as const;

const capstoneLabels = [
  'CSE 110B: Fundamentals of Compiler Design II',
  'CSE 115C: Software Design Project II',
  'CSE 115D: Software Design Project - Accelerated',
  'CSE 121: Embedded System Design',
  'CSE 134: Embedded Operating Systems',
  'CSE 138: Distributed Systems',
  'CSE 140: Artificial Intelligence',
  'CSE 143: Introduction to Natural Language Processing',
  'CSE 144: Applied Machine Learning: Deep Learning',
  'CSE 156: Network Programming',
  'CSE 157: Internet of Things',
  'CSE 160: Introduction to Computer Graphics',
  'CSE 163: Data Programming for Visualization',
  'CSE 168: Introduction to Augmented Reality and Virtual Reality',
  'CSE 181: Database Systems II',
  'CSE 183: Web Applications',
  'CSE 187: Full Stack Web Development II',
  'CMPM 172: Game Production Studio',
] as const;

const CSCapstoneElectives = [
  { option: 'CSE 110B: Fundamentals of Compiler Design II', value: 'CSE110B' },
  { option: 'CSE 115C: Software Design Project II', value: 'CSE115C' },
  { option: 'CSE 115D: Software Design Project - Accelerated', value: 'CSE115D' },
  { option: 'CSE 121: Embedded System Design', value: 'CSE121' },
  { option: 'CSE 134: Embedded Operating Systems', value: 'CSE134' },
  { option: 'CSE 138: Distributed Systems', value: 'CSE138' },
  { option: 'CSE 140: Artificial Intelligence', value: 'CSE140' },
  { option: 'CSE 143: Introduction to Natural Language Processing', value: 'CSE143' },
  { option: 'CSE 144: Applied Machine Learning: Deep Learning', value: 'CSE144' },
  { option: 'CSE 156: Network Programming', value: 'CSE156' },
  { option: 'CSE 157: Internet of Things', value: 'CSE157' },
  { option: 'CSE 160: Introduction to Computer Graphics', value: 'CSE160' },
  { option: 'CSE 163: Data Programming for Visualization', value: 'CSE163' },
  { option: 'CSE 168: Introduction to Augmented Reality and Virtual Reality', value: 'CSE168' },
  { option: 'CSE 181: Database Systems II', value: 'CSE181' },
  { option: 'CSE 183: Web Applications', value: 'CSE183' },
  { option: 'CSE 187: Full Stack Web Development II', value: 'CSE187' },
  { option: 'CMPM 172: Game Production Studio', value: 'CMPM172' },
  { option: 'CSE 195: Senior Thesis Research (ONLY if not used for DC Requirement)', value: 'CSE195' }
];


const alternateElectiveCodes = [
  'AM114', 'AM147', 'CMPM120', 'CMPM131', 'CMPM146', 'CMPM163', 'CMPM164', 'CMPM171', 'CMPM172',
  'MATH110', 'MATH115', 'MATH116', 'MATH117', 'MATH118', 'MATH134', 'MATH145', 'MATH148', 'MATH160',
  'MATH161', 'STAT132', 'PHYS5B', 'PHYS5C', 'PHYS6B', 'PHYS6C'
] as const;

const alternateElectiveLabels = [
  'AM 114: Introduction to Dynamical Systems',
  'AM 147: Computational Methods and Applications',
  'CMPM 120: Game Development Experience',
  'CMPM 131: User Experience for Interactive Media',
  'CMPM 146: Game AI',
  'CMPM 163: Game Graphics and Real-Time Rendering',
  'CMPM 164 / CMPM 164L: Game Engines / Game Engines Lab',
  'CMPM 171: Game Design Studio',
  'CMPM 172: Game Production Studio',
  'MATH 110: Introduction to Number Theory',
  'MATH 115: Graph Theory',
  'MATH 116: Combinatorics',
  'MATH 117: Advanced Linear Algebra',
  'MATH 118: Advanced Number Theory',
  'MATH 134: Cryptography',
  'MATH 145 / MATH 145L: Introductory Chaos Theory / Laboratory',
  'MATH 148: Numerical Anaylsis',
  'MATH 160: Mathematical Logic I',
  'MATH 161: Mathematical Logic II',
  'STAT 132: Classical and Bayesian Inference',
  'PHYS 5B: Introduction to Physics II',
  'PHYS 5C: Introduction to Physics III',
  'PHYS 6B (with completion of PHYS 6A): Introductory Physics II',
  'PHYS 6C (with completion of PHYS 6A): Introductory Physics III',
]

const CSAlternativeElectives = [
  { option: 'AM 114: Introduction to Dynamical Systems', value: 'AM114' },
  { option: 'AM 147: Computational Methods and Applications', value: 'AM147' },
  { option: 'CMPM 120: Game Development Experience', value: 'CMPM120' },
  { option: 'CMPM 131: User Experience for Interactive Media', value: 'CMPM131' },
  { option: 'CMPM 146: Game AI', value: 'CMPM146' },
  { option: 'CMPM 163: Game Graphics and Real-Time Rendering', value: 'CMPM163' },
  { option: 'CMPM 164 / CMPM 164L: Game Engines / Game Engines Lab', value: 'CMPM164' },
  { option: 'CMPM 171: Game Design Studio', value: 'CMPM171' },
  { option: 'CMPM 172: Game Production Studio', value: 'CMPM172' },
  { option: 'MATH 110: Introduction to Number Theory', value: 'MATH110' },
  { option: 'MATH 115: Graph Theory', value: 'MATH115' },
  { option: 'MATH 116: Combinatorics', value: 'MATH116' },
  { option: 'MATH 117: Advanced Linear Algebra', value: 'MATH117' },
  { option: 'MATH 118: Advanced Number Theory', value: 'MATH118' },
  { option: 'MATH 134: Cryptography', value: 'MATH134' },
  { option: 'MATH 145 / MATH 145L: Introductory Chaos Theory / Laboratory', value: 'MATH145' },
  { option: 'MATH 148: Numerical Analysis', value: 'MATH148' },
  { option: 'MATH 160: Mathematical Logic I', value: 'MATH160' },
  { option: 'MATH 161: Mathematical Logic II', value: 'MATH161' },
  { option: 'STAT 132: Classical and Bayesian Inference', value: 'STAT132' },
  { option: 'PHYS 5B: Introduction to Physics II', value: 'PHYS5B' },
  { option: 'PHYS 5C: Introduction to Physics III', value: 'PHYS5C' },
  { option: 'PHYS 6B (with completion of PHYS 6A): Introductory Physics II', value: 'PHYS6B' },
  { option: 'PHYS 6C (with completion of PHYS 6A): Introductory Physics III', value: 'PHYS6C' }
];


type AutoObject = {
  [key: string]: boolean;
};

const auto: AutoObject = codes.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as AutoObject)

const auto2: AutoObject = capstoneCodes.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as AutoObject)

const auto3: AutoObject = alternateElectiveCodes.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as AutoObject)


const RenderMajorElectives: React.FC = () => {
  const { infoData, backgroundCourseData, setBackgroundCourseData } = useFormContext();

  const options = majorLabels.map((label, index) => ({
    option: label,
    value: codes[index]
  }));

  const options2 = capstoneLabels.map((label, index) => ({
    option: label,
    value: capstoneCodes[index]
  }));

  const options3 = alternateElectiveLabels.map((label, index) => ({
    option: label,
    value: alternateElectiveCodes[index]
  }));


  switch (infoData.major) {
    case 'CS':
      return (
        <>
          <MultipleAutocomplete
            title="Major Electives"
            description={
              <>
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 0.5 }}>
                  {`If you have completed any major electives, please indicate so in the next few sections. 
                  Remember that ${infoData.catalogYear === '23' ? 'three' : 'four'} upper-division electives must be completed for 
                  the B.S. in Computer Science.`}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {`The following options in this section lists Computer Science or Computer Engineering (CSE) course 
                    electives that can be used to fulfill the ${infoData.catalogYear === '23' ? 'three' : 'four'} elective requirements.
                    Note that at least one of the ${infoData.catalogYear === '23' ? 'three' : 'four'} elective requirements
                    must be a CSE course.`}
                </Typography>
              </>
            }
            options={CSMajorElectives}
            addPrereq={{}}
            state={backgroundCourseData.completedMajorElectives}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorElectives: arr }))}
          />
          <MultipleAutocomplete
            title="Capstone Electives"
            description={
              <>
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 0.5 }}>
                  {`In addition to the ${infoData.catalogYear === '23' ? 'three' : 'four'} elective course requirements, 
                  all students in the Computer Science B.S. Major must also complete one of two exit requirements: pass one
                  of the listed Capstone Courses, or successfully complete a senior thesis.`}
                </Typography>
                <Typography variant="subtitle2" color="#00e676" sx={{ mb: 1 }}>
                  {`Important: A passed capstone course also counts toward satisfying the ${infoData.catalogYear === '23' ? 'three' : 'four'} 
                  upper-division electives requirement.`}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {`The following options in this section lists all the capstone courses for the Computer Science B.S. Major. 
                    If you have completed any capstone electives, please indicate them here.`}
                </Typography>
              </>
            }
            options={CSCapstoneElectives}
            addPrereq={{}}
            state={backgroundCourseData.completedCapstoneElectives}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedCapstoneElectives: arr }))}
          />
          <MultipleAutocomplete
            title="Alternative Electives"
            description={
              <>
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 0.5 }}>
                  {`The following options in this section lists all the possible alternative electives (non-CSE courses) 
                  that can be used for the Computer Science B.S. Major. If you have completed any of these electives, 
                  please indicate them here.`}
                </Typography>
                <Typography variant="subtitle2" color="#ffb74d" sx={{ mb: 2 }}>
                  {`Important: Of the ${infoData.catalogYear === '23' ? 'three' : 'four'} major elective requirements, up to two of these 
                  electives can be replaced with upper-division mathematics electives (consisting of courses from applied mathematics,
                  mathematics, or statistics), of which at most one can be substituted with two
                  physics classes chosen from the following list of class pairs: PHYS 6A and PHYS 6C, PHYS 6A and PHYS 6B, PHYS 5A 
                  and PHYS 5C, PHYS 5A and PHYS 5B.`}
                </Typography>
              </>
            }
            options={CSAlternativeElectives}
            addPrereq={{}}
            state={backgroundCourseData.completedAlternativeElectives}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedAlternativeElectives: arr }))}
          />
        </>
      );
    default:
      return (
        <Typography sx={{ mt: 4 }}>Your major was not found. Please restart the form.</Typography>
      )

  }
}

export default function MajorElectives() {
  return (
    <>
      <RenderMajorElectives />
    </>
  )
}
