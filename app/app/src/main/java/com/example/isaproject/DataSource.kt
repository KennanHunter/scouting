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
                    "options": [
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
                    ]
                },
                {
                    "type": "radio",
                    "label": "Match Level",
                    "name": "matchlevel",
                    "options": [
                        {
                            "label": "Qualifications",
                            "value": "qual"
                        }
                    ]
                },
                {
                    "type": "number",
                    "label": "Match Number",
                    "name": "matchnumber",
                    "min": "0"
                }
            ]
        },
        {
            "name": "auto",
            "label": "Part 1: Autonomous",
            "page": [
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
                    "type": "divider"
                },
                {
                    "type": "textarea",
                    "label": "Comments",
                    "name": "autocomments"
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
                    "type": "divider"
                },
                {
                    "type": "label",
                    "label": "Endgame"
                },
                {
                    "type": "space"
                },
                {
                    "type": "checkbox",
                    "label": "Trap Scored",
                    "name": "trap"
                },
                {
                    "type": "checkbox",
                    "label": "Climbed",
                    "name": "climbed"
                },
                {
                    "type": "checkbox",
                    "label": "Harmonized",
                    "name": "harmonized"
                },
                {
                    "type": "space"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "textarea",
                    "label": "Comments",
                    "name": "teleopcomments"
                }
            ]
        }
    ]""".trimIndent()
}
