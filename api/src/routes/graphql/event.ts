import { g } from "garph";
import { teamType } from "./team";

export const eventType = g
  .type("Event", {
    key: g.string(),
    name: g.string(),
    startTime: g.int().description("UTF Timestamp of day of competition"),
    teams: g.ref(() => teamType).list(),
  })
  .description("An FRC Event");
