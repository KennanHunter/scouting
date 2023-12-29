package com.example.isaproject

import androidx.compose.runtime.toMutableStateList
import androidx.lifecycle.ViewModel
import kotlinx.serialization.json.Json

class FormViewModel : ViewModel() {
    private val _form = getForm().toMutableStateList()
    val form: List<FormPage>
        get() = _form

    fun changeValue(page: FormPage, item: FormElement, value: String) {
        _form.find {it.name == page.name}?.let { i ->
            i.page.find {it.name == item.name}?. let { j ->
                j.value = value
            }
        }
    }
}

private val formJSON = """
    {
        "form": [
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
        ]
    }
""".trimIndent()

private fun getForm(): List<FormPage> {
    return Json.decodeFromString<Form>(formJSON.trimIndent()).form
}