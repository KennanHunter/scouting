package com.example.isaproject

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
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

    private var _currentDevice by mutableStateOf(Device("NONE", "NONE"))
    val currentDevice: Device
        get() = _currentDevice

    fun setDevice(device: Device) {
        _currentDevice = _devices.first { it.id == device.id }
    }

    private var _answers = mutableStateMapOf<String, Any>()
    val answers: Map<String, Any>
        get() = _answers

    fun setAnswer(name: String, value: Any) {
        _answers[name] = value
    }
}