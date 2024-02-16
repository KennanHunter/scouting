package com.example.isaproject

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.serialization.Serializable

@Serializable
data class SerializableFormPage(
    val name: String,
    val label: String,
    val page: List<SerializableFormElement>
)

@Serializable
data class SerializableFormElement(
    val type: String,
    var name: String = "",
    val label: String = "",
    val placeholder: String = "",
    var options: List<FormOption> = listOf(),
    val columns: String = "1",
    val min: String = "",
    val max: String = "",
    val children: List<SerializableFormElement> = listOf(),
    val content: String = "",
    var initialValue: String = ""
)

enum class FormElementType {
    Label,
    Divider,
    Spacer,
    Image,
    Row,
    Column,
    Text,
    TextArea,
    Number,
    Radio,
    Checkbox,
    Dropdown
}

data class FormPage(
    val name: String,
    val label: String,
    val page: List<FormElement>
)

data class FormElement(
    val type: FormElementType,
    val name: String,
    val label: String,
    val placeholder: String,
    var options: List<FormOption>,
    val columns: Int,
    val min: Int,
    val max: Int,
    val children: List<String>,
    val isChild: Boolean,
    val content: String,
    val initialValue: String,
    private val _expanded: Boolean = false,
    private val _filter: String = "",
    private val _error: String = ""
) {
    var expanded by mutableStateOf(_expanded)
    var filter by mutableStateOf(_filter)
    var error by mutableStateOf(_error)
}

@Serializable
data class FormOption(
    val value: String,
    val label: String
)

@Serializable
data class Device(
    val id: String,
    val name: String
)

enum class ButtonType {
    Outlined,
    Filled
}