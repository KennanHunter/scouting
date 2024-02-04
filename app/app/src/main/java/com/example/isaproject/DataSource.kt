package com.example.isaproject

//TODO: put data about the form and devices into here or go change FormViewModel.kt

object DataSource {
    val deviceJSON = """[
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device2",
            "id": "sldgjftjdrtlkber"
        },
        {
            "name": "Device3",
            "id": "ethesrh"
        },
        {
            "name": "Device4",
            "id": "tjdr6jkrt7"
        },
        {
            "name": "Device5",
            "id": "sdthrs5by"
        },
        {
            "name": "Device6",
            "id": "dtyjfntyr"
        },
        {
            "name": "Device7",
            "id": "sderybery"
        }
    ]""".trimIndent()

    val formJSON = """[
        {
            "name": "prematch",
            "label": "Part 0: Match Information",
            "page": [
                {
                    "type": "dropdown",
                    "label": "Scout Name",
                    "name": "scoutname",
                    "options": []
                },
                {
                    "type": "number",
                    "label": "Match Number",
                    "name": "matchnumber",
                    "min": "0"
                },
                {
                    "type": "checkbox",
                    "label": "No Show",
                    "name": "noshow"
                }
            ]
        },
        {
            "name": "auto",
            "label": "Part 1: Autonomous",
            "page": [
                {
                    "type": "row",
                    "content": [
                        {
                            "type": "radio",
                            "label": "Starting Position",
                            "name": "startingpos",
                            "options": [
                                {
                                    "value": "1",
                                    "label": "1"
                                },
                                {
                                    "value": "2",
                                    "label": "2"
                                },
                                {
                                    "value": "3",
                                    "label": "3"
                                },
                                {
                                    "value": "4",
                                    "label": "4"
                                }
                            ]
                        },
                        {
                            "type": "label",
                            "label": "Note Pickup Locations"
                        },
                        {
                            "type": "checkbox",
                            "label": "1",
                            "name": "1"
                        },
                        {
                            "type": "checkbox",
                            "label": "2",
                            "name": "2"
                        },
                        {
                            "type": "checkbox",
                            "label": "3",
                            "name": "3"
                        },
                        {
                            "type": "checkbox",
                            "label": "4",
                            "name": "4"
                        },
                        {
                            "type": "checkbox",
                            "label": "5",
                            "name": "5"
                        },
                        {
                            "type": "checkbox",
                            "label": "6",
                            "name": "6"
                        },
                        {
                            "type": "checkbox",
                            "label": "7",
                            "name": "7"
                        },
                        {
                            "type": "checkbox",
                            "label": "8",
                            "name": "8"
                        }
                    ]
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "number",
                    "label": "Notes in Amp",
                    "name": "autoamp",
                    "min": "0"
                },
                {
                    "type": "number",
                    "label": "Notes in Speaker",
                    "name": "autospeaker",
                    "min": "0"
                }
            ]
        },
        {
            "name": "teleop",
            "label": "Part 2: Teleop",
            "page": [
                {
                    "type": "number",
                    "label": "Notes in Amp",
                    "name": "teleopamp",
                    "min": "0"
                },
                {
                    "type": "number",
                    "label": "Notes in Speaker",
                    "name": "teleopspeaker",
                    "min": "0"
                },
                {
                    "type": "label",
                    "label": "Scored From"
                },
                {
                    "type": "checkbox",
                    "label": "Subwoofer",
                    "name": "subwoofer"
                },
                {
                    "type": "checkbox",
                    "label": "Podium",
                    "name": "podium"
                },
                {
                    "type": "checkbox",
                    "label": "Within Wing",
                    "name": "wing"
                },
                {
                    "type": "checkbox",
                    "label": "Outside Wing",
                    "name": "outside"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "number",
                    "label": "Notes in Trap",
                    "name": "teleoptrap",
                    "min": "0",
                    "max": "3"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "number",
                    "label": "Time Climb Started",
                    "name": "climbtime",
                    "min": "0",
                    "max": "135"
                },
                {
                    "type": "radio",
                    "label": "Onstage",
                    "name": "onstage",
                    "options": [
                        {
                            "value": "1",
                            "label": "First"
                        },
                        {
                            "value": "2",
                            "label": "Second"
                        },
                        {
                            "value": "3",
                            "label": "Third"
                        },
                        {
                            "value": "0",
                            "label": "Park"
                        }
                    ]
                },
                {
                    "type": "radio",
                    "label": "Number of Other Robots on Same Stage",
                    "name": "harmonize",
                    "options": [
                        {
                            "value": "1",
                            "label": "1"
                        },
                        {
                            "value": "2",
                            "label": "2"
                        }
                    ]
                },
                {
                    "type":"checkbox",
                    "label": "Buddy Climb",
                    "name": "buddy"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "number",
                    "label": "Spotlit by Your Team",
                    "name": "spotlit",
                    "min": "0",
                    "max": "3"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "spacer"
                },
                {
                    "type":"checkbox",
                    "label": "Floor Pick Up",
                    "name": "floor"
                },
                {
                    "type": "checkbox",
                    "label": "Source Pick Up",
                    "name": "source"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "checkbox",
                    "label": "Drove Under Stage",
                    "name": "understage"
                },
                {
                    "type": "checkbox",
                    "label": "Played Defense",
                    "name": "playeddefense"
                },
                {
                    "type": "checkbox",
                    "label": "Received Defense",
                    "name": "receiveddefense"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "checkbox",
                    "label": "Died (stopped moving due to comms issues, electrical problems or other)",
                    "name": "died"
                },
                {
                    "type": "checkbox",
                    "label": "Tipped",
                    "name": "tipped"
                },
                {
                    "type": "checkbox",
                    "label": "Broke (sustained damage)",
                    "name": "broke"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "radio",
                    "label": "Driver Rating (Amongst Same Alliance)",
                    "name": "rating",
                    "options": [
                        {
                            "value": "1",
                            "label": "1"
                        },
                        {
                            "value": "2",
                            "label": "2"
                        },
                        {
                            "value": "3",
                            "label": "3"
                        }
                    ]
                },
                {
                    "type": "textarea",
                    "label": "Comments (including excessive penalties received, A-stop usage, etc)",
                    "name": "comments"
                }
            ]
        }
    ]""".trimIndent()

    val scoutsJSON = """[
        {
            "value": "kennan",
            "label": "Kennan"
        },
        {
            "value": "jessica",
            "label": "Jessica"
        },
        {
            "value": "klee",
            "label": "Klee"
        }
    ]""".trimIndent()

    val nowScouting = "11329"
}
