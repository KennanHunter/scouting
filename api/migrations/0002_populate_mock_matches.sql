-- Migration number: 0002 	 2024-02-05T01:35:20.772Z
INSERT INTO 
  Match (matchKey, startTime, eventKey)
VALUES 
  ("2024mock_qm1", 1707541200720, "2024mock"),
  ("2024mock_qm2", 1707541200780, "2024mock");

INSERT INTO 
  TeamMatchEntry (matchKey, teamNumber, matchData)
VALUES
  -- TODO: Get actual data in here
  -- match 1
  ("2024mock_qm1", 9991, "{}"),
  ("2024mock_qm1", 9992, "{}"),
  ("2024mock_qm1", 9993, "{}"),
  ("2024mock_qm1", 9994, "{}"),
  ("2024mock_qm1", 9995, "{}"),
  ("2024mock_qm1", 9996, "{}"),
  -- match 2
  ("2024mock_qm2", 9998, "{}"),
  ("2024mock_qm2", 9997, "{}"),
  ("2024mock_qm2", 9996, "{}"),
  ("2024mock_qm2", 9995, "{}"),
  ("2024mock_qm2", 9994, "{}"),
  ("2024mock_qm2", 9993, "{}"),