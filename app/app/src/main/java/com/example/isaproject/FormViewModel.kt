package com.example.isaproject

import androidx.compose.runtime.toMutableStateList
import androidx.lifecycle.ViewModel
import kotlinx.serialization.json.Json

class FormViewModel : ViewModel() {
    private val _form = getForm().toMutableStateList()
    val form: List<FormElement>
        get() = _form

    fun changeValue(item: FormElement, value: String) {
        _form.find {it.name == item.name}?.let { i ->
            i.value = value
        }
    }
}

private val formJSON = """
    {
        "form": [
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
            },
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
            }
        ]
    }
""".trimIndent()

private fun getForm(): List<FormElement> {
    return Json.decodeFromString<Form>(formJSON.trimIndent()).form
}