import Select from '../../inputs/Select'

import { useFormContext } from '../../../context/FormContext'

import { InfoData } from '../../../context/FormContext';

import { getStartPlannerOptions } from './StartPlanner';

const getStartTermOptions = (student: string) => {
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  let options = [];

  if (student === 'U' || student === 'T') {
    options = getStartPlannerOptions();
    options.filter(term => !term.option.includes('Spring'));
    return options;
  }


  for (let year = currentYear - 4; year < currentYear; year++) {
    options.push({ option: `Winter ${year}`, value: `W${year % 2000}` });
    options.push({ option: `Fall ${year}`, value: `F${year % 2000}` });
  }

  if (currentMonth > 9) {
    options.push({ option: `Winter ${currentYear}`, value: `W${currentYear % 2000}` });
    options.push({ option: `Fall ${currentYear}`, value: `F${currentYear % 2000}` });
  } else {
    options.push({ option: `Winter ${currentYear}`, value: `W${currentYear % 2000}` });
  }

  return options;
}


export default function StartTerm() {
  const { studentStatus, infoData, setInfoData } = useFormContext();

  const startOptions = getStartTermOptions(studentStatus);

  if (startOptions.length === 0) {
    return null;
  }


  return (
    <Select
      key = {infoData.startDate}
      auto=""
      title="Start Term"
      subtitle={studentStatus === 'C' ? `Select the term you first enrolled at UCSC.` :
        `Indicate the term you will start your first quarter at UCSC.`
      }
      inputLabel="Start Term"
      options={startOptions}
      state={infoData.startDate}
      mutator={(value) => setInfoData((prev: InfoData) => ({ ...prev, startDate: value }))}
    />
  )
}