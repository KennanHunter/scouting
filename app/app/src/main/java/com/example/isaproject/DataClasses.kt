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
    var options: List<FormOption> = listOf(),
    val min: String = "-9999",
    val max: String = "9999",
    val content: List<FormElement> = listOf(),
    var initialValue: String = ""
) {
    var value: List<*> by mutableStateOf(
        if (type == "row" || type == "column") {
            List(content.size){ content[it].value }
        } else {
            listOf(
                when (type) {
                    "number" -> 0
                    "checkbox" -> false
                    else -> initialValue.toIntOrNull() ?: initialValue.toBooleanStrictOrNull() ?: initialValue
                }
            )
        }
    )
    var expanded: List<*> by mutableStateOf(
        if (type == "row" || type == "column") {
            List(content.size){ content[it].expanded }
        } else {
            listOf(false)
        }
    )
    var filter: List<*> by mutableStateOf(
        if (type == "row" || type == "column") {
            List(content.size){ content[it].filter }
        } else {
            listOf("")
        }
    )
    var error: List<*> by mutableStateOf(
        if (type == "row" || type == "column") {
            List(content.size){ content[it].error }
        } else {
            listOf(false)
        }
    )
    var errorMessage: List<*> by mutableStateOf(
        if (type == "row" || type == "column") {
            List(content.size){ content[it].errorMessage }
        } else {
            listOf("")
        }
    )
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