package com.example.isaproject

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.serialization.Serializable

@Serializable
data class Form(
    val form: List<FormPage>
)

@Serializable
data class FormPage(
    val name: String,
    val page: List<FormElement>
)

@Serializable
class FormElement(
    val type: String = "",
    val name: String = "",
    val label: String = "",
    val placeholder: String = "",
    val options: List<String> = listOf(""),
    private val initialValue: String = ""
) {
    var value by mutableStateOf(initialValue)
}