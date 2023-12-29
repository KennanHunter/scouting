package com.example.isaproject

import androidx.compose.runtime.toMutableStateList
import androidx.lifecycle.ViewModel
import kotlinx.serialization.json.Json

class FormViewModel : ViewModel() {
    private val _form = Json.decodeFromString<List<FormPage>>(DataSource.formJSON.trimIndent()).toMutableStateList()
    val form: List<FormPage>
        get() = _form

    fun changeValue(page: FormPage, item: FormElement, value: String) {
        _form.find {it.name == page.name}?.let { i ->
            i.page.find {it.name == item.name}?. let { j ->
                j.value = value
            }
        }
    }

    private val _devices = Json.decodeFromString<List<Device>>(DataSource.deviceJSON.trimIndent()).toMutableStateList()
    val devices: List<Device>
        get() = _devices
}