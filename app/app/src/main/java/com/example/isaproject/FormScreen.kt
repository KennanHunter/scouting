package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Checkbox
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.Dp

@Composable
fun FormScreen(
    formViewModel: FormViewModel,
    page: FormPage,
    onNextButtonClicked: () -> Unit,
    onPreviousButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            PageTitle(text = page.label)
        },
        bottomBar = {
            BottomNavBar(
                canNavigateBack = true,
                nextButtonLabel = stringResource(R.string.next),
                onNextButtonClicked = onNextButtonClicked,
                previousButtonLabel = stringResource(R.string.previous),
                onPreviousButtonClicked = onPreviousButtonClicked
            )
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .padding(innerPadding)
                .padding(all = dimensionResource(R.dimen.margin))
        ) {
            items(
                items = page.page,
                key = { item -> item.name }
            ) { item ->
                formItem(
                    label = item.label,
                    type = item.type,
                    placeholder = item.placeholder,
                    options = item.options,
                    value = item.value,
                    onValueChange = { value -> formViewModel.changeValue(page, item, value) }
                )
            }
        }
    }
}

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
            FormLabel(label = label)
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
    modifier: Modifier = Modifier
) {
    Text(text = label)
}

@Composable
fun FormDivider(
    modifier: Modifier = Modifier
) {
    HorizontalDivider(
        modifier = modifier.padding(vertical = dimensionResource(R.dimen.form_element_space))
    )
}

@Composable
fun FormSpace(
    modifier: Modifier = Modifier,
    height: Dp = dimensionResource(R.dimen.form_element_space)
) {
    Spacer(
        modifier = modifier
            .height(height)
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
        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
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
        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
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
        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") { FormLabel(label = label) }
        Column() {
            for (j in options) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = dimensionResource(R.dimen.option_space))
                ) {
                    RadioButton(
                        selected = j == value,
                        onClick = { onValueChange(j) },
                        modifier = Modifier
                            .size(dimensionResource(R.dimen.option_button_size))
                    )
                    Spacer(modifier = Modifier.width(dimensionResource(R.dimen.option_label_space)))
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
        modifier = modifier
    ) {
        Checkbox(
            checked = value.toBoolean(),
            onCheckedChange = { onValueChange((!value.toBoolean()).toString()) },
            modifier = Modifier.size(dimensionResource(R.dimen.option_button_size))
        )
        Spacer(modifier = Modifier.width(dimensionResource(R.dimen.option_label_space)))
        Text(text = label)
    }
}