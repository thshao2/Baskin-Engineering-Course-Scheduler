import { useFormContext } from "../../../context/FormContext";

import { Typography } from "@mui/material";
import CheckboxResponsive from "../../inputs/CheckboxResponsive";
import CheckboxGroup from "../../inputs/Checkbox";

import { BackgroundCourseData } from "../../../context/FormContext";
import React, { useEffect, useState } from "react";

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
          <CheckboxResponsive
            auto={auto}
            title="Major Electives"
            subtitle={`If you have already completed any CS major electives, 
              please indicate so in this section. Remember that ${infoData.catalogYear === '23' ? 3 : 4} 
              electives must be completed for the B.S. in Computer Science.`}
            options={options}
            state={backgroundCourseData.completedMajorElectives}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedMajorElectives: arr }))}
          />
          <CheckboxResponsive
            auto={auto2}
            title="Capstone Electives"
            subtitle={`A passed capstone elective also counts toward satisfying the ${infoData.catalogYear === '23' ? 3 : 4} 
              upper-division major electives requirement.`}
            options={options2}
            state={backgroundCourseData.completedCapstoneElectives}
            mutator={(arr: string[]) => setBackgroundCourseData((prev: BackgroundCourseData) => ({ ...prev, completedCapstoneElectives: arr }))}
          />
          <CheckboxResponsive
            auto={auto3}
            title="Possible Alternative Electives"
            subtitle= {`Remember that at most two AM/STAT/MATH courses will be counted out of the ${infoData.catalogYear === '23' ? 3 : 4} 
              required electives, of which at most one can be substituted with two physics classes, chosen from the following list of class pairs: 
              PHYS 6A and PHYS 6C, PHYS 6A and PHYS 6B, PHYS 5A and PHYS 5C, PHYS 5A and PHYS 5B. `}
            options={options3}
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
