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

private fun getForm(): List<FormPage> {
    return Json.decodeFromString<Form>(DataSource.formJSON.trimIndent()).form
}