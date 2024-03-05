-- Migration number: 0002 	 2024-02-05T01:35:20.772Z
DELETE FROM Matches;
INSERT INTO 
  Matches (matchKey, startTime, eventKey, reportedWinningAlliance, reportedRedScore, reportedBlueScore)
VALUES
  ("2024mock_qm1", 1707541200720, "2024mock", "red", 120, 80),
  ("2024mock_qm2", 1707541200780, "2024mock", "blue", 60, 80),
  ("2024mock_qm3", 1707541200840, "2024mock", "red", 100, 80);

DELETE FROM TeamMatchEntry;
INSERT INTO TeamMatchEntry (matchKey, teamNumber, alliance, matchData)
VALUES 
  ("2024mock_qm1", 9991, "red", " { ""scoutname"": ""Kennan"",  ""position"": ""Red1"",  ""matchnumber"": 1, ""teamnumber"": 9991, ""noshow"": false, ""startingpos"": ""A"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": true,  ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": true,  ""autoamp"": 2,    ""autospeaker"": 0,    ""leave"": true,  ""teleopamp"": 8,    ""teleopspeaker"": 0,     ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 1,    ""climbtime"": 15,   ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 1,    ""sourcepickup"": 1,    ""understage"": true,  ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""2"",    ""comments"": ""good amp bot"" }"),
  ("2024mock_qm1", 9992, "red", " { ""scoutname"": ""Mady"",    ""position"": ""Red2"",  ""matchnumber"": 1, ""teamnumber"": 9992, ""noshow"": true,  ""startingpos"": null,  ""autonote1"": null,  ""autonote2"": null,  ""autonote3"": null,  ""autonote4"": null,  ""autonote5"": null,  ""autonote6"": null,  ""autonote7"": null,  ""autonote8"": null,  ""autoamp"": null, ""autospeaker"": null, ""leave"": null,  ""teleopamp"": null, ""teleopspeaker"": null,  ""shotfromsubwoofer"": null,  ""shotfrompodium"": null,  ""shotfromwing"": null,  ""shotfromoutside"": null,  ""teleoptrap"": null, ""climbtime"": null, ""onstageorder"": ""0"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": null,  ""spotlit"": null, ""floorpickup"": null, ""sourcepickup"": null, ""understage"": null,  ""playeddefense"": null,  ""receiveddefense"": null,  ""died"": null,  ""tipped"": null,  ""broke"": null,  ""rating"": null,     ""comments"": """" }"),
  ("2024mock_qm1", 9993, "red", " { ""scoutname"": ""Jiping"",  ""position"": ""Red3"",  ""matchnumber"": 1, ""teamnumber"": 9993, ""noshow"": false, ""startingpos"": ""B"", ""autonote1"": true,  ""autonote2"": false, ""autonote3"": false, ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 2,    ""leave"": true,  ""teleopamp"": 1,    ""teleopspeaker"": 6,     ""shotfromsubwoofer"": true,  ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": 5,    ""onstageorder"": ""0"",     ""amplifications"": 1, ""harmonizeqty"": ""1"",    ""buddy"": false, ""spotlit"": 1,    ""floorpickup"": 0,    ""sourcepickup"": 1,    ""understage"": false, ""playeddefense"": false, ""receiveddefense"": false, ""died"": true,  ""tipped"": false, ""broke"": false, ""rating"": ""3"",    ""comments"": ""meh speaker bot"" }"),
  ("2024mock_qm1", 9994, "blue", "{ ""scoutname"": ""Pam"",     ""position"": ""Blue1"", ""matchnumber"": 1, ""teamnumber"": 9994, ""noshow"": false, ""startingpos"": ""C"", ""autonote1"": false, ""autonote2"": true,  ""autonote3"": false, ""autonote4"": false, ""autonote5"": false, ""autonote6"": true,  ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 1,    ""leave"": true,  ""teleopamp"": 4,    ""teleopspeaker"": 3,     ""shotfromsubwoofer"": false, ""shotfrompodium"": true,  ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": null, ""onstageorder"": ""0"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 1,    ""sourcepickup"": 0,    ""understage"": false, ""playeddefense"": false, ""receiveddefense"": true,  ""died"": false, ""tipped"": false, ""broke"": true,  ""rating"": ""1"",    ""comments"": ""impressive can switch between speaker and amp"" }"),
  ("2024mock_qm1", 9995, "blue", "{ ""scoutname"": ""Scott"",   ""position"": ""Blue2"", ""matchnumber"": 1, ""teamnumber"": 9995, ""noshow"": false, ""startingpos"": ""D"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": false, ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 0,    ""leave"": false, ""teleopamp"": 5,    ""teleopspeaker"": 0,     ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": 20,   ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": ""1"",    ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 0,    ""sourcepickup"": 1,    ""understage"": true,  ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""3"",    ""comments"": """" }"), 
  ("2024mock_qm1", 9996, "blue", "{ ""scoutname"": ""Abbey"",   ""position"": ""Blue3"", ""matchnumber"": 1, ""teamnumber"": 9996, ""noshow"": false, ""startingpos"": ""A"", ""autonote1"": true,  ""autonote2"": true,  ""autonote3"": true,  ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 4,    ""leave"": true,  ""teleopamp"": 0,    ""teleopspeaker"": 9,     ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": true,  ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": 10,   ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 1,    ""sourcepickup"": 0,    ""understage"": false, ""playeddefense"": false, ""receiveddefense"": true,  ""died"": false, ""tipped"": true,  ""broke"": false, ""rating"": ""1"",    ""comments"": ""super fast cycles;"" }"),
  -- match 2
  ("2024mock_qm2", 9998, "red", " { ""scoutname"": ""Jessica"", ""position"": ""Red1"",  ""matchnumber"": 2, ""teamnumber"": 9998, ""noshow"": false, ""startingpos"": ""B"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": false, ""autonote4"": true,  ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 1,    ""autospeaker"": 1,    ""leave"": true,  ""teleopamp"": 2,    ""teleopspeaker"": 5,     ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": true,  ""shotfromoutside"": true,  ""teleoptrap"": 2,    ""climbtime"": 10,   ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 1,    ""sourcepickup"": 1,    ""understage"": true,  ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""2"",    ""comments"": ""good all around bot"" }"),
  ("2024mock_qm2", 9997, "red", " { ""scoutname"": ""Ezrah"",   ""position"": ""Red2"",  ""matchnumber"": 2, ""teamnumber"": 9997, ""noshow"": false, ""startingpos"": ""C"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": true,  ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 1,    ""leave"": true,  ""teleopamp"": 0,    ""teleopspeaker"": 6,     ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": true,  ""shotfromoutside"": false, ""teleoptrap"": 1,    ""climbtime"": 42,   ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": ""2"",    ""buddy"": true,  ""spotlit"": 3,    ""floorpickup"": 0,    ""sourcepickup"": 1,    ""understage"": true,  ""playeddefense"": true,  ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""3"",    ""comments"": ""used the a stop"" }"),
  ("2024mock_qm2", 9996, "red", " { ""scoutname"": ""Ross"",    ""position"": ""Red3"",  ""matchnumber"": 2, ""teamnumber"": 9996, ""noshow"": false, ""startingpos"": ""D"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": true,  ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 1,    ""leave"": true,  ""teleopamp"": 0,    ""teleopspeaker"": 10,    ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": true,  ""teleoptrap"": 0,    ""climbtime"": null, ""onstageorder"": ""0"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 1,    ""sourcepickup"": 0,    ""understage"": false, ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""1"",    ""comments"": """" }"),
  ("2024mock_qm2", 9995, "blue", "{ ""scoutname"": ""Ava"",     ""position"": ""Blue1"", ""matchnumber"": 2, ""teamnumber"": 9995, ""noshow"": false, ""startingpos"": ""A"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": false, ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 1,    ""leave"": false, ""teleopamp"": 0,    ""teleopspeaker"": 2,     ""shotfromsubwoofer"": true,  ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": 8,    ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 0,    ""sourcepickup"": 1,    ""understage"": false, ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""3"",    ""comments"": ""terrible driving, got penalties"" }"),
  ("2024mock_qm2", 9994, "blue", "{ ""scoutname"": ""Carter"",  ""position"": ""Blue2"", ""matchnumber"": 2, ""teamnumber"": 9994, ""noshow"": false, ""startingpos"": ""B"", ""autonote1"": false, ""autonote2"": true,  ""autonote3"": false, ""autonote4"": false, ""autonote5"": true,  ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 3,    ""autospeaker"": 0,    ""leave"": true,  ""teleopamp"": 3,    ""teleopspeaker"": 0,     ""shotfromsubwoofer"": false, ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 3,    ""climbtime"": 3,    ""onstageorder"": ""2"",     ""amplifications"": 1, ""harmonizeqty"": ""1"",    ""buddy"": false, ""spotlit"": 1,    ""floorpickup"": 1,    ""sourcepickup"": 0,    ""understage"": false, ""playeddefense"": true,  ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""2"",    ""comments"": ""great harmonizeqty at the last second"" }"),
  ("2024mock_qm2", 9993, "blue", "{ ""scoutname"": ""Landon"",  ""position"": ""Blue3"", ""matchnumber"": 2, ""teamnumber"": 9993, ""noshow"": false, ""startingpos"": ""C"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": true,  ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 1,    ""leave"": true,  ""teleopamp"": 0,    ""teleopspeaker"": 8,     ""shotfromsubwoofer"": true,  ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": 21,   ""onstageorder"": ""3"",     ""amplifications"": 1, ""harmonizeqty"": ""2"",    ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 1,    ""sourcepickup"": 1,    ""understage"": true,  ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""1"",    ""comments"": """" }"),
  -- match 3
  ("2024mock_qm3", 9996, "red", " { ""scoutname"": ""Traevor"", ""position"": ""Red1"",  ""matchnumber"": 3, ""teamnumber"": 9996, ""noshow"": false, ""startingpos"": ""D"", ""autonote1"": false, ""autonote2"": false, ""autonote3"": false, ""autonote4"": false, ""autonote5"": false, ""autonote6"": false, ""autonote7"": false, ""autonote8"": false, ""autoamp"": 0,    ""autospeaker"": 0,    ""leave"": false, ""teleopamp"": 0,    ""teleopspeaker"": 4,     ""shotfromsubwoofer"": true,  ""shotfrompodium"": false, ""shotfromwing"": false, ""shotfromoutside"": false, ""teleoptrap"": 0,    ""climbtime"": 17,   ""onstageorder"": ""1"",     ""amplifications"": 1, ""harmonizeqty"": null, ""buddy"": false, ""spotlit"": 0,    ""floorpickup"": 0,    ""sourcepickup"": 1,    ""understage"": true,  ""playeddefense"": false, ""receiveddefense"": false, ""died"": false, ""tipped"": false, ""broke"": false, ""rating"": ""2"",    ""comments"": """" }");
