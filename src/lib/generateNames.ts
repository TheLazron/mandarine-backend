import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  starWars,
} from "unique-names-generator";

const generateName = (): string => {
  const customConfig: Config = {
    dictionaries: [adjectives, starWars],
    separator: "-",
    length: 2,
  };

  const shortName: string = uniqueNamesGenerator(customConfig);

  return shortName;
};

export default generateName;
