package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Checkbox
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

@Composable
fun formItem(
    label: String,
    type: String,
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    options: List<String>,
    modifier: Modifier = Modifier
) {
    when (type) {
        "label" -> {
            FormLabel(
                label = label,
                doMargin = true
            )
        }
        "divider" -> {
            FormDivider()
        }
        "text" -> {
            TextInput(
                value = value,
                onValueChange = onValueChange,
                placeholder = placeholder,
                label = label
            )
        }
        "number" -> {
            NumberInput(
                value = value,
                onValueChange = onValueChange,
                placeholder = placeholder,
                label = label
            )
        }
        "radio" -> {
            RadioInput(
                value = value,
                onValueChange = onValueChange,
                options = options,
                label = label
            )
        }
        "checkbox" -> {
            CheckboxInput(
                value = value,
                onValueChange = onValueChange,
                label = label
            )
        }
    }
}

val margin = 20.dp
val spaceBetweenElements = 8.dp
val numberInputButtonSize = 40.dp

@Composable
fun FormLabel(
    label: String,
    doMargin: Boolean = false,
    modifier: Modifier = Modifier
) {
    Text(
        text = label,
        modifier = modifier.padding(horizontal = if (doMargin) margin else 0.dp)
    )
}

@Composable
fun FormDivider(
    modifier: Modifier = Modifier
) {
    HorizontalDivider(
        modifier = modifier.padding(
            horizontal = margin,
            vertical = spaceBetweenElements
        )
    )
}

@Composable
fun TextInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    label: String
) {
    Column(
        modifier = Modifier.padding(
            bottom = spaceBetweenElements,
            start = margin,
            end = margin
        )
    ) {
        if (label != "") { FormLabel(label = label) }
        TextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            placeholder = { Text(placeholder) },
            modifier = modifier.fillMaxWidth()
        )
    }
}

@Composable
fun NumberInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    label: String
) {
    Column(
        modifier = Modifier.padding(
            bottom = spaceBetweenElements,
            start = margin,
            end = margin
        )
    ) {
        if (label != "") { FormLabel(label = label) }
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { onValueChange(((value.toIntOrNull() ?: 0) - 1).toString()) },
                modifier = Modifier.size(numberInputButtonSize)
            ) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = "Minus 1",
                )
            }
            TextField(
                value = value,
                onValueChange = onValueChange,
                singleLine = true,
                placeholder = { Text(placeholder) },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Number
                ),
                modifier = modifier.weight(1f)
            )
            IconButton(
                onClick = { onValueChange(((value.toIntOrNull() ?: 0) + 1).toString()) },
                modifier = Modifier.size(numberInputButtonSize)
            ) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowUp,
                    contentDescription = "Plus 1",
                )
            }
        }
    }
}

@Composable
fun RadioInput(
    value: String,
    onValueChange: (String) -> Unit,
    options: List<String>,
    modifier: Modifier = Modifier,
    label: String
) {
    Column(
        modifier = Modifier.padding(
            bottom = spaceBetweenElements,
            start = margin,
            end = margin
        )
    ) {
        if (label != "") { FormLabel(label = label) }
        Column(modifier = modifier.padding(0.dp)) {
            for (j in options) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = j == value,
                        onClick = { onValueChange(j) }
                    )
                    Text(j)
                }
            }
        }
    }
}

@Composable
fun CheckboxInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier.padding(horizontal = margin)
    ) {
        Checkbox(
            checked = value.toBoolean(),
            onCheckedChange = { onValueChange((!value.toBoolean()).toString()) },
            modifier = modifier
        )
        Text(text = label)
    }
}