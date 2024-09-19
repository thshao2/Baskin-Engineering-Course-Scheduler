import Select from '../../inputs/Select'

import { useFormContext } from '../../../context/FormContext'

import { InfoData } from '../../../context/FormContext';

const getStartPlannerOptions = () => {
  const date = new Date();
  const currentMonth = date.getMonth();
  // const currentMonth = 2;
  const currentYear = date.getFullYear();
  const currentYearShort = currentYear % 2000;

  const options = [];

  if (currentMonth > 9) {
    options.push({ option: `Winter ${currentYear + 1}`, value: `W${currentYearShort + 1}` })
    options.push({ option: `Spring ${currentYear + 1}`, value: `S${currentYearShort + 1}` })
  } else if (currentMonth > 3) {
    options.push({ option: `Fall ${currentYear}`, value: `F${currentYearShort}` })
    options.push({ option: `Winter ${currentYear + 1}`, value: `W${currentYearShort + 1}` })
  } else if (currentMonth > 0) {
    options.push({ option: `Spring ${currentYear}`, value: `S${currentYearShort}` })
    if (currentMonth > 1) {
      options.push({ option: `Fall ${currentYear}`, value: `F${currentYearShort}` })
    }
  } else {
    options.push({ option: `Winter ${currentYear}`, value: `W${currentYearShort}` })
    options.push({ option: `Spring ${currentYear}`, value: `S${currentYearShort}` })
  }

  return options;
}

export default function StartPlanner() {

  const startOptions = getStartPlannerOptions();
  const { infoData, setInfoData } = useFormContext();

  return (
    <Select
      auto="F24"
      title="Planner Start Date"
      subtitle={`Select the quarter this generated academic planner will start from (e.g. ${startOptions[0].option}). The available dates are based on today's date.`}
      inputLabel="Planner Start Date"
      options={startOptions}
      state={infoData.startPlanner}
      mutator={(value) => setInfoData((prev: InfoData) => ({ ...prev, startPlanner: value }))}
    />
  )

}