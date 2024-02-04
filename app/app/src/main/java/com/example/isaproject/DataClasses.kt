package com.example.isaproject

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.serialization.Serializable
import kotlin.math.max

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
    var options: List<FormOption> = listOf(),
    val min: String = "-9999",
    val max: String = "9999",
    val content: List<FormElement> = listOf(),
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
    var expanded by mutableStateOf(
        if (type == "column" || type == "row") {
            "false;;;".repeat(max(0, content.size - 1)) + if (content.size > 0) { "false" }
        } else {
            "false"
        }
    )
    var filter by mutableStateOf("")
    var error by mutableStateOf(
        if (type == "column" || type == "row") {
            "false;;;".repeat(max(0, content.size - 1)) + if (content.size > 0) { "false" }
        } else {
            "false"
        }
    )
    var errorMessage by mutableStateOf("")
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

data class ButtonPress(
    val button: String,
    val time: String
)