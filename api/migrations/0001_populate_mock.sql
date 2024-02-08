-- Migration number: 0001 	 2024-02-04T23:58:56.311Z
DELETE FROM Events;

INSERT INTO
  Events (eventKey, eventName, startTime)
VALUES
  ("2024mock", "Mock Event", 1707541200000);

DELETE FROM Teams;

INSERT INTO
  Teams (teamName, teamNumber, nickname)
VALUES
  ("Off-Season Demo 1", 9991, "Demo 1"),
  ("Off-Season Demo 2", 9992, "Demo 2"),
  ("Off-Season Demo 3", 9993, "Demo 3"),
  ("Off-Season Demo 4", 9994, "Demo 4"),
  ("Off-Season Demo 5", 9995, "Demo 5"),
  ("Off-Season Demo 6", 9996, "Demo 6"),
  ("Off-Season Demo 7", 9997, "Demo 7"),
  ("Off-Season Demo 8", 9998, "Demo 8"),
  ("Off-Season Demo 9", 9999, "Demo 9");

DELETE FROM TeamEventAppearance;

INSERT INTO
  TeamEventAppearance (eventKey, teamNumber)
VALUES
  ("2024mock", 9991),
  ("2024mock", 9992),
  ("2024mock", 9993),
  ("2024mock", 9994),
  ("2024mock", 9995),
  ("2024mock", 9996),
  ("2024mock", 9998),
  ("2024mock", 9999);