package com.example.isaproject

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
            "name": "FormPage1",
            "label": "Part 1: Auto",
            "page": [
                {
                    "type": "text",
                    "label": "bar",
                    "name": "text",
                    "placeholder": "text"
                },
                {
                    "type": "number",
                    "label": "foo",
                    "name": "number",
                    "placeholder": "number",
                    "initialValue": "0"
                },
                {
                    "type": "divider"
                },
                {
                    "type": "radio",
                    "label": "lorem ipsum sit dolor amet",
                    "name": "radio",
                    "options": [
                        {
                            "label": "one",
                            "value": "1"
                        },
                        {
                            "label": "two",
                            "value": "2"
                        },
                        {
                            "label": "three",
                            "value": "3"
                        }
                    ]
                },
                {
                    "type": "radio",
                    "label": "Another lorem ipsum sit dolor amet",
                    "name": "radio2",
                    "options": [
                        {
                            "label": "alpha",
                            "value": "alpha"
                        },
                        {
                            "label": "beta",
                            "value": "beta"
                        },
                        {
                            "label": "whatever comes after beta",
                            "value": "gamma"
                        }
                    ]
                },
                {
                    "type": "radio",
                    "label": "lorem ipsum sit dolor amet #3",
                    "name": "radio3",
                    "options": [
                        {
                            "label": "one",
                            "value": "a"
                        },
                        {
                            "label": "beta",
                            "value": "b"
                        },
                        {
                            "label": "C",
                            "value": "c"
                        }
                    ]
                }
            ]
        },
        {
            "name": "FormPage2",
            "label": "Part 2: Teleop",
            "page": [
                {
                    "type": "label",
                    "label": "hello"
                },
                {
                    "type": "checkbox",
                    "label": "sldkfhesoi;rhj",
                    "name": "check",
                    "initialValue": "false"
                },
                {
                    "type": "checkbox",
                    "label": "sldkfhesdsoi;rhj",
                    "name": "check2",
                    "initialValue": "false"
                },
                {
                    "type": "checkbox",
                    "label": ";lkdfn",
                    "name": "check3",
                    "initialValue": "false"
                },
                {
                    "type": "space"
                },
                {
                    "type": "number",
                    "name": "abcde",
                    "initialValue": "0",
                    "label": "Another number"
                }
            ]
        }
    ]""".trimIndent()
}