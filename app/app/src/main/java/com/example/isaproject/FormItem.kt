package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.isaproject.ui.theme.ISAProjectTheme

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
        "space" -> {
            FormSpace()
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

@Composable
fun FormLabel(
    label: String,
    doMargin: Boolean = false,
    modifier: Modifier = Modifier
) {
    Text(
        text = label,
        modifier = modifier.padding(horizontal = if (doMargin) dimensionResource(R.dimen.margin) else 0.dp)
    )
}

@Composable
fun FormDivider(
    modifier: Modifier = Modifier
) {
    HorizontalDivider(
        modifier = modifier.padding(
            horizontal = dimensionResource(R.dimen.margin),
            vertical = dimensionResource(R.dimen.form_element_space)
        )
    )
}

@Composable
fun FormSpace(
    modifier: Modifier = Modifier
) {
    Spacer(
        modifier = modifier
            .height(dimensionResource(R.dimen.form_element_space))
            .fillMaxWidth()
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
            bottom = dimensionResource(R.dimen.form_element_space),
            start = dimensionResource(R.dimen.margin),
            end = dimensionResource(R.dimen.margin)
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
            bottom = dimensionResource(R.dimen.form_element_space),
            start = dimensionResource(R.dimen.margin),
            end = dimensionResource(R.dimen.margin)
        )
    ) {
        if (label != "") { FormLabel(label = label) }
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { onValueChange(((value.toIntOrNull() ?: 0) - 1).toString()) },
                modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
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
                modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
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
            bottom = dimensionResource(R.dimen.form_element_space),
            start = dimensionResource(R.dimen.margin),
            end = dimensionResource(R.dimen.margin)
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
        modifier = modifier.padding(
            horizontal = dimensionResource(R.dimen.margin)
        )
    ) {
        Checkbox(
            checked = value.toBoolean(),
            onCheckedChange = { onValueChange((!value.toBoolean()).toString()) },
            modifier = Modifier
        )
        Text(text = label)
    }
}