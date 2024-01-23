package com.example.isaproject

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.serialization.Serializable

@Serializable
data class FormPage(
    val name: String,
    val label: String,
    val page: List<FormElement>
)

@Serializable
class FormElement(
    val type: String,
    val name: String = "",
    val label: String = "",
    val placeholder: String = "",
    val options: List<FormOption> = listOf(FormOption("", "")),
    val min: String = "-9999",
    val max: String = "9999",
    var error: Boolean = false,
    var errorMessage: String = "",
    private val initialValue: String = ""
) {
    var value by mutableStateOf(
        if (initialValue == "") {
            if (type == "number") {
                "0"
            } else if (type == "checkbox") {
                "false"
            } else {
                initialValue
            }
        } else {
            initialValue
        }
    )
    var expanded by mutableStateOf(false)
    var filter by mutableStateOf("")
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