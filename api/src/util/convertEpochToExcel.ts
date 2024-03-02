export const convertEpochToExcel: (startTime: number) => string = (
  startTime
) => {
  // TODO: Fix this
  const time = new Date();

  return `${time.getMonth()}/${time.getDay()}/${time.getFullYear()} ${time.toTimeString().split(" ")[0]}`;
};
