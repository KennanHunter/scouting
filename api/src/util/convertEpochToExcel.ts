export const convertEpochToExcel: (startTime: number) => string = (
  startTime
) => {
  const time = new Date(startTime);

  return `${time.getMonth()}/${time.getDay()}/${time.getFullYear()} ${time.toTimeString().split(" ")[0]}`;
};
