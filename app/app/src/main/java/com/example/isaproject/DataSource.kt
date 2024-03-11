package com.example.isaproject

//TODO: put data about the form and devices into here or go change FormViewModel.kt

object DataSource {
    val deviceJSON = """[
        {
            "name": "Device1",
            "id": "device1"
        },
        {
            "name": "Device2",
            "id": "device2"
        },
        {
            "name": "Device3",
            "id": "device3"
        },
        {
            "name": "Device4",
            "id": "device4"
        },
        {
            "name": "Device5",
            "id": "device5"
        },
        {
            "name": "Device6",
            "id": "device6"
        },
        {
            "name": "Device7",
            "id": "device7"
        }
    ]""".trimIndent()

    val formJSON = """[
        {
            "name": "Part 1: Autonomous",
            "page": [
                {
                    "type": "row",
                    "children": [
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "radio",
                                    "label": "Starting Position",
                                    "name": "startingpos",
                                    "columns": "2",
                                    "options": [
                                        {
                                            "value": "a",
                                            "label": "A"
                                        },
                                        {
                                            "value": "c",
                                            "label": "C"
                                        },
                                        {
                                            "value": "b",
                                            "label": "B"
                                        },
                                        {
                                            "value": "d",
                                            "label": "D"
                                        }
                                    ]
                                },
                                {
                                    "type": "label",
                                    "label": "Notes Picked Up / Moved"
                                },
                                {
                                    "type": "row",
                                    "children": [
                                        {
                                            "type": "column",
                                            "children": [
                                                {
                                                    "type": "checkbox",
                                                    "label": "1",
                                                    "name": "autonote1"
                                                },
                                                {
                                                    "type": "checkbox",
                                                    "label": "2",
                                                    "name": "autonote2"
                                                },
                                                {
                                                    "type": "checkbox",
                                                    "label": "3",
                                                    "name": "autonote3"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "column",
                                            "children": [
                                                {
                                                    "type": "checkbox",
                                                    "label": "4",
                                                    "name": "autonote4"
                                                },
                                                {
                                                    "type": "checkbox",
                                                    "label": "5",
                                                    "name": "autonote5"
                                                },
                                                {
                                                    "type": "checkbox",
                                                    "label": "6",
                                                    "name": "autonote6"
                                                },
                                                {
                                                    "type": "checkbox",
                                                    "label": "7",
                                                    "name": "autonote7"
                                                },
                                                {
                                                    "type": "checkbox",
                                                    "label": "8",
                                                    "name": "autonote8"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "number",
                                    "label": "Scored in Amp",
                                    "name": "autoamp",
                                    "min": "0"
                                },
                                {
                                    "type": "number",
                                    "label": "Scored in Speaker",
                                    "name": "autospeaker",
                                    "min": "0"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Left Robot Starting Zone (bumpers must be fully out of the red-shaded RSZ)",
                                    "name": "leave"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "conditional",
                    "property": "scoutPos",
                    "variants": [
                        {
                            "value": "A",
                            "content": {
                                "type": "image",
                                "content": "auto_locations_source_2024",
                                "label": "Key to Ground Note Locations"
                            }
                        },
                        {
                            "value": "B",
                            "content": {
                                "type": "image",
                                "content": "auto_locations_amp_2024",
                                "label": "Key to Ground Note Locations"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "name": "Part 2: Teleop",
            "page": [
                {
                    "type": "row",
                    "children": [
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "number",
                                    "label": "Scored in Amp",
                                    "name": "teleopamp",
                                    "min": "0"
                                },
                                {
                                    "type": "number",
                                    "label": "Scored in Speaker",
                                    "name": "teleopspeaker",
                                    "min": "0"
                                },
                                {
                                    "type": "number",
                                    "label": "Scored in Trap",
                                    "name": "teleoptrap",
                                    "min": "0",
                                    "max": "3"
                                },
                                {
                                    "type": "label",
                                    "label": "Scored From (speaker only)"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Subwoofer",
                                    "name": "shotfromsubwoofer"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Podium",
                                    "name": "shotfrompodium"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Within Wing",
                                    "name": "shotfromwing"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Outside Wing",
                                    "name": "shotfromoutside"
                                }
                            ]
                        },
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "image",
                                    "content": "shooting_locations_2024",
                                    "label": "Key to Scoring Locations"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "row",
                    "children": [
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "number",
                                    "label": "Time Climb Started (seconds left)",
                                    "name": "climbtime",
                                    "min": "0",
                                    "max": "135"
                                },
                                {
                                    "type": "radio",
                                    "label": "Order Onstage (on same chain)",
                                    "name": "onstageorder",
                                    "columns": "2",
                                    "initialValue": "0",
                                    "exportAs": "int",
                                    "options": [
                                        {
                                            "value": "1",
                                            "label": "First"
                                        },
                                        {
                                            "value": "3",
                                            "label": "Third"
                                        },
                                        {
                                            "value": "2",
                                            "label": "Second"
                                        },
                                        {
                                            "value": "4",
                                            "label": "Park"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "radio",
                                    "label": "Number of Other Robots on Same Stage",
                                    "name": "harmonizeqty",
                                    "columns": "2",
                                    "initialValue": "0",
                                    "exportAs": "int",
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
                                    "label": "Provided Climb Assistance (for same chain)",
                                    "name": "buddy"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "spacer"
                },
                {
                    "type": "row",
                    "children": [
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type":"checkbox",
                                    "label": "Floor Pick Up",
                                    "name": "floorpickup",
                                    "exportAs": "int"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Source Pick Up",
                                    "name": "sourcepickup",
                                    "exportAs": "int"
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
                                }
                            ]
                        },
                        {
                            "type": "column",
                            "children": [
                                {
                                    "type": "checkbox",
                                    "label": "Died (stopped moving due to comms issues, electrical problems or other)",
                                    "name": "died"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Tipped (completely)",
                                    "name": "tipped"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Broke (sustained damage)",
                                    "name": "broke"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Part 3: Post-Match",
            "page": [
                {
                    "type": "number",
                    "label": "Number of Amplifications",
                    "name": "amplifications",
                    "min": "0"
                },
                {
                    "type": "number",
                    "label": "Spotlit by Your Team",
                    "name": "spotlit",
                    "min": "0",
                    "max": "3"
                },
                {
                    "type": "radio",
                    "label": "Driver Ranking (within same alliance)",
                    "name": "rating",
                    "columns": "3",
                    "initialValue": "0",
                    "exportAs": "int",
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

    // TODO: update this at some point?
    val scouts = listOf(
        "Aaron D. (461)",
        "Alasdair W. (461)",
        "Alex S. (45)",
        "Annika L. (5402)",
        "Baileigh D. (829)",
        "Brianna S. (829)",
        "Bryce G. (461)",
        "Ceci W. (9431)",
        "Cindy G. (461)",
        "Cody S. (4272)",
        "Daimon O. (461)",
        "Dalton M. (829)",
        "David H. (5484)",
        "Donna S. (1501)",
        "Doug R. (1501)",
        "Dylan R. (461)",
        "Emma S. (1501)",
        "Ethan J (5484)",
        "Ewan B. (45)",
        "Hafsa H. (461)",
        "Isaac W. (461)",
        "Ismail T. (461)",
        "Jared R. (3940)",
        "Jaxon B. (45)",
        "Jayden E. (4272)",
        "Jenna G. (45)",
        "JiuJiu L. (461)",
        "Joe S. (1501)",
        "Jonathon R. (3940)",
        "Jordin C. (5402)",
        "Juana (Jay) G. (829)",
        "Kaileb H. (3940)",
        "Kelton S. (45)",
        "Levi S. (1501)",
        "Melody B. (9431)",
        "Noelle C. (829)",
        "Phoenix R. (829)",
        "Piper G. (3940)",
        "Raphael Y. (461)",
        "Rita C. (461)",
        "Sarah S. (1501)",
        "Serena M. (461)",
        "Shelby P. (5402)",
        "Trevor G. (45)",
        "Valeria C. (5402)",
        "Vinrai B. (45)",
        "Xander K. (45)",
        "Zach Z. (45)"
    )
}