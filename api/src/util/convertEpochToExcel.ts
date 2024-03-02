export const convertEpochToExcel: (startTime: number) => string = (
  startTime
) => {
  // TODO: Fix this
  const time = new Date(startTime * 1000);

  return `${time.getMonth()}/${time.getDay()}/${time.getFullYear()} ${time.toTimeString().split(" ")[0]}`;
};
