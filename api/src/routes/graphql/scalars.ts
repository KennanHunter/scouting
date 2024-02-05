import { g } from "garph";

export const dateType = g
  .scalarType<Date, number>("Date", {
    serialize: (value) => value.getTime(),
    parseValue: (value) => new Date(value),
  })
  .description("UTC Date");
