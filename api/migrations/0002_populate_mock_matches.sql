-- Migration number: 0002 	 2024-02-05T01:35:20.772Z
INSERT INTO 
  Matches (matchKey, startTime, eventKey)
VALUES 
  ("2024mock_qm1", 1707541200720, "2024mock"),
  ("2024mock_qm2", 1707541200780, "2024mock"),
  ("2024mock_qm3", 1707541200840, "2024mock");

INSERT INTO 
  TeamMatchEntry (matchKey, teamNumber, alliance, matchData)
VALUES
  -- match 1
  ("2024mock_qm1", 9991, "red", "{ ""scoutname"": ""Kennan"", ""matchnumber"": 1, ""teamnumber"": 9991, ""noshow"": 0, ""startingpos"": 1, ""1"": 0, ""2"": 0, ""3"": 1, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 1, ""autoamp"": 2, ""autospeaker"": 0, ""leave"": 1, ""teleopamp"": 8, ""teleopspeaker"": 0, ""subwoofer"": 0, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 1, ""climbtime"": 15, ""onstage"": 1, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 1, ""source"": 1, ""understage"": 1, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 2, ""comments"": ""good amp bot"" }"),
  ("2024mock_qm1", 9992, "red", "{ ""scoutname"": ""Mady"", ""matchnumber"": 1, ""teamnumber"": 9992, ""noshow"": 1, ""startingpos"": null, ""1"": null, ""2"": null, ""3"": null, ""4"": null, ""5"": null, ""6"": null, ""7"": null, ""8"": null, ""autoamp"": null, ""autospeaker"": null, ""leave"": null, ""teleopamp"": null, ""teleopspeaker"": null, ""subwoofer"": null, ""podium"": null, ""wing"": null, ""outside"": null, ""teleoptrap"": null, ""climbtime"": null, ""onstage"": null, ""harmonize"": null, ""buddy"": null, ""spotlit"": null, ""floor"": null, ""source"": null, ""understage"": null, ""playeddefense"": null, ""receiveddefense"": null, ""died"": null, ""tipped"": null, ""broke"": null, ""rating"": null, ""comments"": """" }"),
  ("2024mock_qm1", 9993, "red", "{ ""scoutname"": ""Jiping"", ""matchnumber"": 1, ""teamnumber"": 9993, ""noshow"": 0, ""startingpos"": 2, ""1"": 1, ""2"": 0, ""3"": 0, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 2, ""leave"": 1, ""teleopamp"": 0, ""teleopspeaker"": 6, ""subwoofer"": 1, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": 5, ""onstage"": 2, ""harmonize"": 1, ""buddy"": 0, ""spotlit"": 1, ""floor"": 0, ""source"": 1, ""understage"": 0, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 1, ""tipped"": 0, ""broke"": 0, ""rating"": 3, ""comments"": ""meh speaker bot!"" }"),
  ("2024mock_qm1", 9994, "blue", "{ ""scoutname"": ""Pam"", ""matchnumber"": 1, ""teamnumber"": 9994, ""noshow"": 0, ""startingpos"": 3, ""1"": 0, ""2"": 1, ""3"": 0, ""4"": 0, ""5"": 0, ""6"": 1, ""7"": 0, ""8"": 0, ""autoamp"": 1, ""autospeaker"": 1, ""leave"": 1, ""teleopamp"": 4, ""teleopspeaker"": 3, ""subwoofer"": 0, ""podium"": 1, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": null, ""onstage"": 0, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 1, ""source"": 0, ""understage"": 0, ""playeddefense"": 0, ""receiveddefense"": 1, ""died"": 0, ""tipped"": 0, ""broke"": 1, ""rating"": 1, ""comments"": ""impressive can switch between speaker and amp"" }"),
  ("2024mock_qm1", 9995, "blue", "{ ""scoutname"": ""Scott"", ""matchnumber"": 1, ""teamnumber"": 9995, ""noshow"": 0, ""startingpos"": 4, ""1"": 0, ""2"": 0, ""3"": 0, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 1, ""autospeaker"": 0, ""leave"": 0, ""teleopamp"": 5, ""teleopspeaker"": 0, ""subwoofer"": 0, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": 20, ""onstage"": 1, ""harmonize"": 1, ""buddy"": 0, ""spotlit"": 2, ""floor"": 0, ""source"": 1, ""understage"": 1, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 3, ""comments"": """" }"),
  ("2024mock_qm1", 9996, "blue", "{ ""scoutname"": ""Abbey"", ""matchnumber"": 1, ""teamnumber"": 9996, ""noshow"": 0, ""startingpos"": 1, ""1"": 1, ""2"": 1, ""3"": 1, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 4, ""leave"": 1, ""teleopamp"": 0, ""teleopspeaker"": 9, ""subwoofer"": 0, ""podium"": 0, ""wing"": 1, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": 10, ""onstage"": 1, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 1, ""source"": 0, ""understage"": 0, ""playeddefense"": 0, ""receiveddefense"": 1, ""died"": 0, ""tipped"": 1, ""broke"": 0, ""rating"": 1, ""comments"": ""super fast cycles;"" }"),
  -- match 2
  ("2024mock_qm2", 9998, "red", "{ ""scoutname"": ""Jessica"", ""matchnumber"": 2, ""teamnumber"": 9998, ""noshow"": 0, ""startingpos"": 2, ""1"": 0, ""2"": 0, ""3"": 0, ""4"": 1, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 1, ""autospeaker"": 1, ""leave"": 1, ""teleopamp"": 2, ""teleopspeaker"": 5, ""subwoofer"": 0, ""podium"": 0, ""wing"": 1, ""outside"": 1, ""teleoptrap"": 2, ""climbtime"": 10, ""onstage"": 1, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 1, ""source"": 1, ""understage"": 1, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 2, ""comments"": ""good all around bot"" }"),
  ("2024mock_qm2", 9997, "red", "{ ""scoutname"": ""Ezrah"", ""matchnumber"": 2, ""teamnumber"": 9997, ""noshow"": 0, ""startingpos"": 3, ""1"": 0, ""2"": 0, ""3"": 1, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 1, ""leave"": 1, ""teleopamp"": 0, ""teleopspeaker"": 6, ""subwoofer"": 0, ""podium"": 0, ""wing"": 1, ""outside"": 0, ""teleoptrap"": 1, ""climbtime"": 42, ""onstage"": 1, ""harmonize"": 2, ""buddy"": 1, ""spotlit"": 3, ""floor"": 0, ""source"": 1, ""understage"": 1, ""playeddefense"": 1, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 3, ""comments"": ""used the a stop"" }"),
  ("2024mock_qm2", 9996, "red", "{ ""scoutname"": ""Ross"", ""matchnumber"": 2, ""teamnumber"": 9996, ""noshow"": 0, ""startingpos"": 4, ""1"": 0, ""2"": 0, ""3"": 1, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 1, ""leave"": 1, ""teleopamp"": 0, ""teleopspeaker"": 10, ""subwoofer"": 0, ""podium"": 0, ""wing"": 0, ""outside"": 1, ""teleoptrap"": 0, ""climbtime"": null, ""onstage"": 0, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 1, ""source"": 0, ""understage"": 0, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 1, ""comments"": """" }"),
  ("2024mock_qm2", 9995, "blue", "{ ""scoutname"": ""Ava"", ""matchnumber"": 2, ""teamnumber"": 9995, ""noshow"": 0, ""startingpos"": 1, ""1"": 0, ""2"": 0, ""3"": 0, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 1, ""leave"": 0, ""teleopamp"": 0, ""teleopspeaker"": 2, ""subwoofer"": 1, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": 8, ""onstage"": 1, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 0, ""source"": 1, ""understage"": 0, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 3, ""comments"": ""terrible driving, got penalties"" }"),
  ("2024mock_qm2", 9994, "blue", "{ ""scoutname"": ""Carter"", ""matchnumber"": 2, ""teamnumber"": 9994, ""noshow"": 0, ""startingpos"": 2, ""1"": 0, ""2"": 1, ""3"": 0, ""4"": 0, ""5"": 1, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 3, ""autospeaker"": 0, ""leave"": 1, ""teleopamp"": 3, ""teleopspeaker"": 0, ""subwoofer"": 0, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 3, ""climbtime"": 3, ""onstage"": 2, ""harmonize"": 1, ""buddy"": 0, ""spotlit"": 1, ""floor"": 1, ""source"": 0, ""understage"": 0, ""playeddefense"": 1, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 2, ""comments"": ""great harmonize at the last second"" }"),
  ("2024mock_qm2", 9993, "blue", "{ ""scoutname"": ""Landon"", ""matchnumber"": 2, ""teamnumber"": 9993, ""noshow"": 0, ""startingpos"": 3, ""1"": 0, ""2"": 0, ""3"": 1, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 1, ""leave"": 1, ""teleopamp"": 0, ""teleopspeaker"": 8, ""subwoofer"": 1, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": 21, ""onstage"": 3, ""harmonize"": 2, ""buddy"": 0, ""spotlit"": 0, ""floor"": 1, ""source"": 1, ""understage"": 1, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 1, ""comments"": """" }"),
  -- match 3
  ("2024mock_qm3", 9996, "red", "{ ""scoutname"": ""Traevor"", ""matchnumber"": 3, ""teamnumber"": 9996, ""noshow"": 0, ""startingpos"": 4, ""1"": 0, ""2"": 0, ""3"": 0, ""4"": 0, ""5"": 0, ""6"": 0, ""7"": 0, ""8"": 0, ""autoamp"": 0, ""autospeaker"": 0, ""leave"": 0, ""teleopamp"": 0, ""teleopspeaker"": 4, ""subwoofer"": 1, ""podium"": 0, ""wing"": 0, ""outside"": 0, ""teleoptrap"": 0, ""climbtime"": 17, ""onstage"": 1, ""harmonize"": null, ""buddy"": 0, ""spotlit"": 0, ""floor"": 0, ""source"": 1, ""understage"": 1, ""playeddefense"": 0, ""receiveddefense"": 0, ""died"": 0, ""tipped"": 0, ""broke"": 0, ""rating"": 2, ""comments"": """" }");