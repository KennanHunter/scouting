-- Migration number: 0000 	 2024-02-04T23:24:36.502Z

DROP TABLE IF EXISTS TeamMatchEntry;
DROP TABLE IF EXISTS TeamEventAppearance;
DROP TABLE IF EXISTS Matches;
DROP TABLE IF EXISTS Teams;
DROP TABLE IF EXISTS Events;

CREATE TABLE IF NOT EXISTS Teams (
  teamNumber INTEGER UNIQUE PRIMARY KEY,
  teamName TEXT,
  nickname TEXT
);

CREATE TABLE IF NOT EXISTS Events (
  eventKey TEXT UNIQUE PRIMARY KEY,
  eventName TEXT NOT NULL,
  startTime INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS TeamEventAppearance (
  eventKey TEXT,
  teamNumber INTEGER,
  PRIMARY KEY (eventKey, teamNumber),
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey),
  FOREIGN KEY(teamNumber) REFERENCES Teams(teamNumber)
);

CREATE TABLE IF NOT EXISTS Matches (
  matchKey TEXT UNIQUE PRIMARY KEY,
  startTime INTEGER,
  eventKey TEXT,
  reportedWinningAlliance TEXT,
  reportedRedScore INTEGER,
  reportedBlueScore INTEGER,
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey)
);

CREATE TABLE IF NOT EXISTS TeamMatchEntry (
  matchKey TEXT,
  teamNumber INTEGER,
  alliance TEXT,
  -- Match data is in JSON 
  matchData TEXT,
  PRIMARY KEY (matchKey, teamNumber),
  FOREIGN KEY(matchKey) REFERENCES Matches(matchKey),
  FOREIGN KEY(teamNumber) REFERENCES Teams(teamNumber)
);
