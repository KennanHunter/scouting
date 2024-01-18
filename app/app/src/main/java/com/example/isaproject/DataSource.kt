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
            "name": "auto",
            "label": "Part 1: Autonomous",
            "page": [
                {
                    "type": "number",
                    "label": "Notes in Amp",
                    "name": "autoamp",
                    "initialValue": "0",
                    "min": 0
                },
                {
                    "type": "number",
                    "label": "Notes in Speaker",
                    "name": "autospeaker",
                    "initialValue": "0",
                    "min": 0,
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
                    "initialValue": "0",
                    "min": 0
                },
                {
                    "type": "number",
                    "label": "Notes in Speaker",
                    "name": "teleopspeaker",
                    "initialValue": "0",
                    "min": 0
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
                    "name": "trap",
                    "initialValue": "false"
                },
                {
                    "type": "checkbox",
                    "label": "Climbed",
                    "name": "climbed",
                    "initialValue": "false"
                },
                {
                    "type": "checkbox",
                    "label": "Harmonized",
                    "name": "harmonized",
                    "initialValue": "false"
                },
                {
                    "type": "divider"
                }
                {
                    "type": "textarea",
                    "label": "Comments",
                    "name": "teleopcomments"
                }
            ]
        }
    ]""".trimIndent()
}
