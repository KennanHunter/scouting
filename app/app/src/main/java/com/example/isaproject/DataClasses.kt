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
    val layersContained: String = "",
    private val initialValue: String = ""
) {
    var value: String by mutableStateOf(
        if (initialValue == "") {
            when (type) {
                "number" -> {
                    "0"
                }
                "checkbox" -> {
                    "false"
                }
                "column", "row" -> {
                    var newValue = ""
                    for (i in content.indices) {
                        if (i != content.indices.first) {
                            newValue += ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))
                        }
                        newValue += content[i].value
                    }
                    newValue
                }
                else -> {
                    initialValue
                }
            }
        } else {
            initialValue
        }
    )
    var expanded by mutableStateOf(
        if (type == "column" || type == "row") {
            ("false" + ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).repeat(max(0, content.size - 1)) + if (content.isNotEmpty()) { "false" } else {}
        } else {
            "false"
        }
    )
    var filter by mutableStateOf("")
    var error by mutableStateOf(
        if (type == "column" || type == "row") {
            ("false" + ";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).repeat(max(0, content.size - 1)) + if (content.isNotEmpty()) { "false" } else {}
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