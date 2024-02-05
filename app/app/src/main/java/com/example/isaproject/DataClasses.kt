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
    val layersContained: String = "",
    private val initialValue: String = ""
) {
    var value: Any by mutableStateOf(
        if (initialValue == "") {
            when (type) {
                "number" -> {
                    0
                }
                "checkbox" -> {
                    false
                }
                "column", "row" -> {
                    List(content.size) { content[it].value }
                }
                else -> {
                    initialValue.toIntOrNull() ?: initialValue.toBooleanStrictOrNull() ?: initialValue
                }
            }
        } else {
            initialValue.toIntOrNull() ?: initialValue.toBooleanStrictOrNull() ?: initialValue
        }
    )
    var expanded: String by mutableStateOf(
        if (type == "column" || type == "row") {
            run {
                // "false;;;true;;;false"
                var newExpanded = ""
                for (i in content.indices) {
                    if (i != content.indices.first) {
                        newExpanded += ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))
                    }
                    newExpanded += content[i].expanded
                }
                newExpanded
            }
        } else {
            "false"
        }
    )
    var filter: String by mutableStateOf(
        if (type == "column" || type == "row" && content.isNotEmpty()) {
            run {
                var newFilter = ""
                for (i in content.indices) {
                    if (i != content.indices.first) {
                        newFilter += ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))
                    }
                    newFilter += content[i].filter
                }
                newFilter
            }
        } else {
            ""
        }
    )
    var error: String by mutableStateOf(
        if (type == "column" || type == "row") {
            run {
                var newError = ""
                for (i in content.indices) {
                    if (i != content.indices.first) {
                        newError += ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))
                    }
                    newError += content[i].error
                }
                newError
            }
        } else {
            "false"
        }
    )
    var errorMessage: String by mutableStateOf(
        if (type == "column" || type == "row" && content.isNotEmpty()) {
            run {
                var newErrorMessage = ""
                for (i in content.indices) {
                    if (i != content.indices.first) {
                        newErrorMessage += ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))
                    }
                    newErrorMessage += content[i].errorMessage
                }
                newErrorMessage
            }
        } else {
            ""
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