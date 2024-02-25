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
                                    "label": "Note Pickup Locations"
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
                                    "label": "Notes in Amp",
                                    "name": "autoamp",
                                    "min": "0"
                                },
                                {
                                    "type": "number",
                                    "label": "Notes in Speaker",
                                    "name": "autospeaker",
                                    "min": "0"
                                },
                                {
                                    "type": "checkbox",
                                    "label": "Leave",
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
                                    "type": "number",
                                    "label": "Notes in Trap",
                                    "name": "teleoptrap",
                                    "min": "0",
                                    "max": "3"
                                },
                                {
                                    "type": "label",
                                    "label": "Scored From"
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
                                    "label": "Time Climb Started",
                                    "name": "climbtime",
                                    "min": "0",
                                    "max": "135"
                                },
                                {
                                    "type": "radio",
                                    "label": "Onstage",
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
                                    "label": "Buddy Climb",
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
                                    "label": "Tipped",
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
                    "label": "Driver Rating (within same alliance)",
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
        "Kennan",
        "Jessica",
        "Klee"
    )
}