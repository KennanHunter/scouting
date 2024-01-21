DROP TABLE IF EXISTS Teams;

CREATE TABLE IF NOT EXISTS Teams (
  teamName TEXT,
  teamNumber INTEGER UNIQUE PRIMARY KEY,
  nickname TEXT
);

DROP TABLE IF EXISTS Events;

CREATE TABLE IF NOT EXISTS Events (
  eventKey TEXT UNIQUE PRIMARY KEY,
  eventName TEXT NOT NULL,
  startTime INTEGER NOT NULL
);

DROP TABLE IF EXISTS Match;

CREATE TABLE IF NOT EXISTS Match (
  matchKey TEXT UNIQUE PRIMARY KEY,
  eventName TEXT,
  startTime INTEGER,
  eventKey TEXT,
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey)
);

DROP TABLE IF EXISTS TeamMatchEntry;

CREATE TABLE IF NOT EXISTS TeamMatchEntry (
  matchKey TEXT,
  teamNumber INTEGER,
  matchData TEXT,
  PRIMARY KEY (matchKey, teamNumber),
  FOREIGN KEY(matchKey) REFERENCES Match(matchKey),
  FOREIGN KEY(teamNumber) REFERENCES Teams(teamNumber)
);