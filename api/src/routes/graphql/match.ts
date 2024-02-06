import { g } from "garph";

export const allianceEnum = g.enumType("Alliance", ["red", "blue"]);

export const matchEntry = g.type("MatchEntry", {
  matchKey: g.string(),
  teamNumber: g.int(),
  alliance: allianceEnum,
  matchData: g.string(),
});

export const matchType = g.type("Match", {
  matchKey: g.string(),
  startTime: g.int(),
  eventKey: g.string(),
  matchEntries: g.ref(matchEntry).list(),
});
