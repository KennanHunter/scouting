import { g } from "garph";
import { teamType } from "./team";
import { dateType } from "./scalars";

export const eventType = g
  .type("Event", {
    key: g.string(),
    name: g.string(),
    startTime: g
      .ref(dateType)
      .description("UTC Timestamp of day of competition"),
    teams: g.ref(teamType).list(),
  })
  .description("An FRC Event");
