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
    val options: List<FormRadioOption> = listOf(FormRadioOption("", "")),
    val min: Int = -9999,
    val max: Int = 9999,
    var error: Boolean = false,
    var errorMessage: String = "",
    private val initialValue: String = ""
) {
    var value by mutableStateOf(initialValue)
}

@Serializable
data class FormRadioOption(
    val value: String,
    val label: String
)

@Serializable
data class Device(
    val id: String,
    val name: String
)