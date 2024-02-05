@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.isaproject

import android.content.Context
import androidx.compose.foundation.clickable
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
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
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
import androidx.compose.ui.platform.LocalContext
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
    val context = LocalContext.current
    Scaffold(
        topBar = {
            PageTitle(
                text = page.label,
                nowScouting = formViewModel.nowScouting
            )
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
            items(page.page) { item ->
                FormItem(
                    item = item,
                    onValueChange = {
                        formViewModel.setAnswer(item.name, it)
                        formViewModel.setValue(page, item, it)
                    },
                    onExpandedChange = {
                        formViewModel.setExpanded(page, item, it)
                    },
                    onFilterChange = {
                        formViewModel.setFilter(page, item, it)
                    },
                    onErrorChange = { error, errorMessage ->
                        formViewModel.setError(page, item, error, errorMessage)
                    },
                    context = context
                )
            }
        }
    }
}

@Composable
fun FormItem(
    item: FormElement,
    onValueChange: (Any) -> Unit,
    onExpandedChange: (String) -> Unit,
    onFilterChange: (String) -> Unit,
    onErrorChange: (String, String) -> Unit,
    context: Context,
    modifier: Modifier = Modifier
) {
    when (item.type) {
        "label" -> {
            FormLabel(
                label = item.label,
                modifier = modifier
            )
        }

        "divider" -> {
            FormDivider(
                modifier = modifier
            )
        }

        "spacer" -> {
            FormSpace(
                modifier = modifier
            )
        }

        "row" -> {
            FormRow(
                content = item.content,
                value = item.value,
                onValueChange = onValueChange,
                expanded = item.expanded,
                onExpandedChange = onExpandedChange,
                filter = item.filter,
                onFilterChange = onFilterChange,
                error = item.error,
                errorMessage = item.errorMessage,
                onErrorChange = onErrorChange,
                layersContained = item.layersContained,
                context = context
            )
        }

        "column" -> {
            FormColumn(
                content = item.content,
                value = item.value,
                onValueChange = onValueChange,
                expanded = item.expanded,
                onExpandedChange = onExpandedChange,
                filter = item.filter,
                onFilterChange = onFilterChange,
                error = item.error,
                errorMessage = item.errorMessage,
                onErrorChange = onErrorChange,
                layersContained = item.layersContained,
                context = context
            )
        }

        "text" -> {
            TextInput(
                value = item.value,
                onValueChange = onValueChange,
                placeholder = item.placeholder,
                label = item.label,
                modifier = modifier
            )
        }

        "textarea" -> {
            TextAreaInput(
                value = item.value,
                onValueChange = onValueChange,
                placeholder = item.placeholder,
                label = item.label,
                modifier = modifier
            )
        }

        "number" -> {
            NumberInput(
                value = item.value,
                onValueChange = onValueChange,
                placeholder = item.placeholder,
                label = item.label,
                error = item.error,
                errorMessage = item.errorMessage,
                onErrorChange = onErrorChange,
                min = item.min.toIntOrNull() ?: -9999,
                max = item.max.toIntOrNull() ?: 9999,
                context = context,
                modifier = modifier
            )
        }

        "radio" -> {
            RadioInput(
                value = item.value,
                onValueChange = onValueChange,
                options = item.options,
                label = item.label,
                modifier = modifier
            )
        }

        "checkbox" -> {
            CheckboxInput(
                value = item.value,
                onValueChange = onValueChange,
                label = item.label,
                modifier = modifier
            )
        }

        "dropdown" -> {
            DropdownInput(
                onValueChange = onValueChange,
                expanded = item.expanded,
                onExpandedChange = onExpandedChange,
                options = item.options,
                label = item.label,
                filter = item.filter,
                onFilterChange = onFilterChange,
                modifier = modifier
            )
        }
    }
}

@Composable
fun FormLabel(
    label: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = label,
        modifier = modifier
    )
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
fun FormRow(
    content: List<FormElement>,
    value: Any,
    onValueChange: (Any) -> Unit,
    expanded: String,
    onExpandedChange: (String) -> Unit,
    filter: String,
    onFilterChange: (String) -> Unit,
    error: String,
    errorMessage: String,
    onErrorChange: (String, String) -> Unit,
    context: Context,
    layersContained: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
    ) {
        FormGroup(
            content = content,
            value = value,
            onValueChange = onValueChange,
            expanded = expanded,
            onExpandedChange = onExpandedChange,
            filter = filter,
            onFilterChange = onFilterChange,
            error = error,
            errorMessage = errorMessage,
            onErrorChange = onErrorChange,
            context = context,
            layersContained = layersContained
        )
    }
}

@Composable
fun FormColumn(
    content: List<FormElement>,
    value: Any,
    onValueChange: (Any) -> Unit,
    expanded: String,
    onExpandedChange: (String) -> Unit,
    filter: String,
    onFilterChange: (String) -> Unit,
    error: String,
    errorMessage: String,
    onErrorChange: (String, String) -> Unit,
    context: Context,
    layersContained: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
    ) {
        FormGroup(
            content = content,
            value = value,
            onValueChange = onValueChange,
            expanded = expanded,
            onExpandedChange = onExpandedChange,
            filter = filter,
            onFilterChange = onFilterChange,
            error = error,
            errorMessage = errorMessage,
            onErrorChange = onErrorChange,
            context = context,
            layersContained = layersContained
        )
    }
}

@Composable
fun FormGroup(
    content: List<FormElement>,
    value: Any,
    onValueChange: (Any) -> Unit,
    expanded: String,
    onExpandedChange: (String) -> Unit,
    filter: String,
    onFilterChange: (String) -> Unit,
    error: String,
    errorMessage: String,
    onErrorChange: (String, String) -> Unit,
    context: Context,
    layersContained: String
) {
    for (i in content.indices) {
        var newElement = content[i]
        if (value is List<*>) {
            newElement.value = value[i] ?: "Index out of range"
        } else {
            newElement.value = "Value is not an array"
        }
        if (i < expanded.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).size){
            newElement.expanded = expanded.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0)))[i]
        } else {
            newElement.expanded = "false"
        }
        if (i < filter.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).size){
            newElement.filter = filter.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0)))[i]
        } else {
            newElement.filter = filter
        }
        if (i < error.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).size){
            newElement.error = error.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0)))[i]
        } else {
            newElement.error = "false"
        }
        if (i < errorMessage.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).size){
            newElement.errorMessage = errorMessage.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0)))[i]
        } else {
            newElement.errorMessage = "false"
        }
        FormItem(
            item = newElement,
            onValueChange = {
                if (value is List<*>) {
                    var newValue = value.toMutableList()
                    newValue[i] = it
                    onValueChange(newValue)
                } else {
                    onValueChange("Value is not a list")
                }
            },
            onExpandedChange = {
                var newExpanded = expanded.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).toMutableList()
                if (i < newExpanded.size) {
                    newExpanded[i] = it
                }
                onExpandedChange(newExpanded.joinToString(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))))
            },
            onFilterChange = {
                var newFilter = filter.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).toMutableList()
                if (i < newFilter.size) {
                    newFilter[i] = it
                }
                onFilterChange(newFilter.joinToString(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))))
            },
            onErrorChange = { it1, it2 ->
                var newError = error.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).toMutableList()
                if (i < newError.size) {
                    newError[i] = it1
                }
                var newErrorMessage = errorMessage.split(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))).toMutableList()
                if (i < newErrorMessage.size) {
                    newErrorMessage[i] = it2
                }
                onErrorChange(
                    newError.joinToString(";".repeat(3 + (layersContained.toIntOrNull() ?: 0))),
                    newErrorMessage.joinToString(";".repeat(3 + (layersContained.toIntOrNull() ?: 0)))
                )
            },
            context = context
        )
    }
}

@Composable
fun TextInput(
    value: Any,
    onValueChange: (Any) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    label: String
) {
    Column(
        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") {
            FormLabel(label = label)
        }
        TextField(
            value = value.toString(),
            onValueChange = onValueChange,
            singleLine = true,
            placeholder = { Text(placeholder) },
            modifier = modifier.fillMaxWidth()
        )
    }
}

@Composable
fun TextAreaInput(
    value: Any,
    onValueChange: (Any) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    label: String
) {
    if (label != "") {
        FormLabel(label = label)
    }
    TextField(
        value = value.toString(),
        onValueChange = onValueChange,
        singleLine = false,
        placeholder = { Text(placeholder) },
        modifier = modifier.fillMaxWidth()
    )
}

@Composable
fun NumberInput(
    value: Any,
    onValueChange: (Any) -> Unit,
    placeholder: String,
    error: String,
    errorMessage: String,
    onErrorChange: (String, String) -> Unit,
    min: Int,
    max: Int,
    modifier: Modifier = Modifier,
    context: Context,
    label: String
) {
    Column(
        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") {
            FormLabel(label = label)
        }
        Row {
            TextField(
                value = value.toString(),
                onValueChange = {
                    if ((it.toIntOrNull() ?: 0) < min) {
                        onErrorChange("true", context.getString(R.string.minimum_value_is) + min)
                    } else if ((it.toIntOrNull() ?: 0) > max) {
                        onErrorChange("true", context.getString(R.string.maximum_value_is) + max)
                    } else if (error.toBoolean()) {
                        onErrorChange("false", "")
                    }
                    onValueChange(it.toIntOrNull() ?: 0)
                },
                singleLine = true,
                placeholder = { Text(placeholder) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                isError = error.toBoolean(),
                supportingText = {
                    if (error.toBoolean()) {
                        Text(errorMessage)
                    }
                },
                leadingIcon = {
                    IconButton(
                        onClick = { onValueChange(((value.toString().toIntOrNull() ?: 0) - 1).toString()) },
                        modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
                    ) {
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = "Minus 1",
                        )
                    }
                },
                trailingIcon = {
                    IconButton(
                        onClick = { onValueChange(((value.toString().toIntOrNull() ?: 0) + 1).toString()) },
                        modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
                    ) {
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowUp,
                            contentDescription = "Plus 1",
                        )
                    }
                },
                modifier = modifier.weight(1f)
            )
        }
    }
}

@Composable
fun RadioInput(
    value: Any,
    onValueChange: (Any) -> Unit,
    options: List<FormOption>,
    modifier: Modifier = Modifier,
    label: String
) {
    Column(
        modifier = modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") {
            FormLabel(label = label)
        }
        Column {
            for (j in options) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .padding(bottom = dimensionResource(R.dimen.option_space))
                        .clickable { onValueChange(j.value) }
                ) {
                    RadioButton(
                        selected = j.value == value,
                        onClick = { onValueChange(j.value) },
                        modifier = Modifier
                            .size(dimensionResource(R.dimen.option_button_size))
                    )
                    Spacer(modifier = Modifier.width(dimensionResource(R.dimen.option_label_space)))
                    Text(j.label)
                }
            }
        }
    }
}

@Composable
fun CheckboxInput(
    value: Any,
    onValueChange: (Any) -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier.clickable { onValueChange((!value.toString().toBoolean())) }
    ) {
        Checkbox(
            checked = value.toString().toBoolean(),
            onCheckedChange = { onValueChange((!value.toString().toBoolean())) },
            modifier = Modifier.size(dimensionResource(R.dimen.option_button_size))
        )
        Spacer(modifier = Modifier.width(dimensionResource(R.dimen.option_label_space)))
        Text(text = label)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DropdownInput(
    onValueChange: (String) -> Unit,
    expanded: String,
    onExpandedChange: (String) -> Unit,
    options: List<FormOption>,
    label: String,
    filter: String,
    onFilterChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") {
            FormLabel(label = label)
        }
        Row {
            ExposedDropdownMenuBox(
                expanded = expanded.toBoolean(),
                onExpandedChange = { onExpandedChange(it.toString()) }
            ) {
                TextField(
                    modifier = Modifier.menuAnchor().fillMaxWidth(),
                    value = filter,
                    onValueChange = onFilterChange,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded.toBoolean()) },
                    colors = ExposedDropdownMenuDefaults.textFieldColors()
                )
                val filteringOptions = options.filter { it.label.contains(filter, ignoreCase = true) }
                if (filteringOptions.isNotEmpty()) {
                    ExposedDropdownMenu(
                        expanded = expanded.toBoolean(),
                        onDismissRequest = { onExpandedChange(false.toString()) }
                    ) {
                        filteringOptions.forEach { dropdownOption ->
                            DropdownMenuItem(
                                text = { Text(dropdownOption.label) },
                                onClick = {
                                    onValueChange(dropdownOption.value)
                                    onFilterChange(dropdownOption.label)
                                    onExpandedChange(false.toString())
                                },
                                contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                            )
                        }
                    }
                }
            }
        }
    }
}