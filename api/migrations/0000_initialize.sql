-- Migration number: 0000 	 2024-02-04T23:24:36.502Z
DROP TABLE IF EXISTS Teams;

CREATE TABLE IF NOT EXISTS Teams (
  teamNumber INTEGER UNIQUE PRIMARY KEY,
  teamName TEXT,
  nickname TEXT
);

DROP TABLE IF EXISTS Events;

CREATE TABLE IF NOT EXISTS Events (
  eventKey TEXT UNIQUE PRIMARY KEY,
  eventName TEXT NOT NULL,
  startTime INTEGER NOT NULL
);

DROP TABLE IF EXISTS TeamEventAppearance;

CREATE TABLE IF NOT EXISTS TeamEventAppearance (
  eventKey TEXT,
  teamNumber INTEGER,
  PRIMARY KEY (eventKey, teamNumber),
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey),
  FOREIGN KEY(teamNumber) REFERENCES Teams(teamNumber)
);

DROP TABLE IF EXISTS Match;

CREATE TABLE IF NOT EXISTS Match (
  matchKey TEXT UNIQUE PRIMARY KEY,
  startTime INTEGER,
  eventKey TEXT,
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey)
);

DROP TABLE IF EXISTS TeamMatchEntry;

CREATE TABLE IF NOT EXISTS TeamMatchEntry (
  matchKey TEXT,
  teamNumber INTEGER,
  -- Match data is in JSON 
  matchData TEXT,
  PRIMARY KEY (matchKey, teamNumber),
  FOREIGN KEY(matchKey) REFERENCES Match(matchKey),
  FOREIGN KEY(teamNumber) REFERENCES Teams(teamNumber)
);

