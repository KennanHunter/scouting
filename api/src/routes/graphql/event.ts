import { g } from "garph";

export const eventType = g.node("Event", {
  eventKey: g.string(),
  eventName: g.string(),
  startTime: g.int(),
});
