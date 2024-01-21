import { g } from "garph";

export const eventType = g
  .type("Event", {
    id: g.string(),
    name: g.string(),
  })
  .description("An FRC Event");
