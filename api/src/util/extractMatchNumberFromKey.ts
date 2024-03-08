export const extractMatchNumberFromKey = (key: string | undefined) => {
  if (!key) return Number.MIN_SAFE_INTEGER;

  const subKey = key.split("_")[1];
  const isQualifier = subKey[0].toLowerCase() === "q";
  return isQualifier
    ? Number.parseInt(subKey.substring(2))
    : Number.MAX_SAFE_INTEGER;
};
