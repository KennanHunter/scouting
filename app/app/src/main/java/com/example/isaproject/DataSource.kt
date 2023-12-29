package com.example.isaproject

object DataSource {
    val deviceJSON = """[
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device1",
            "id": "sldgjlkber"
        },
        {
            "name": "Device1",
            "id": "sldgjlkber"
        }
    ]""".trimIndent()

    val formJSON = """[
        {
            "name": "FormPage1",
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
                    "type": "divider",
                    "name": "divider"
                },
                {
                    "type": "radio",
                    "label": "lorem ipsum sit dolor amet",
                    "name": "radio",
                    "options": [
                      "one",
                      "two",
                      "three"
                    ]
                }
            ]
        },
        {
            "name": "FormPage2",
            "page": [
                {
                    "type": "label",
                    "label": "hello",
                    "name": "hello"
                },
                {
                    "type": "checkbox",
                    "label": "sldkfhesoi;rhj",
                    "name": "check"
                },
                {
                    "type": "checkbox",
                    "label": "sldkfhesdsoi;rhj",
                    "name": "check2"
                },
                {
                    "type": "checkbox",
                    "label": ";lkdfn",
                    "name": "check3"
                },
                {
                    "type": "space",
                    "name": "sdlk"
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