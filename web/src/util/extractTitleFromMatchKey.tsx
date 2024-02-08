export const extractTitleFromMatchKey = (key: string): string => {
  const match = key.split("_")[1];

  const typeToLabel = {
    qm: "Qualifier",
  };

  const type = match.substring(0, 2);

  if (!Object.keys(typeToLabel).includes(type))
    return `Unrecognized Match - ${key}`;

  const matchNumber = Number.parseInt(match.substring(2));

  return `${typeToLabel[type as keyof typeof typeToLabel]} ${matchNumber}`;
};
