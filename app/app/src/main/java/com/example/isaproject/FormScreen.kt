@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.isaproject

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.Image
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
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.painterResource
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
                    onValueChange = { it1, it2 ->
                        formViewModel.setAnswer(it1, it2)
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
                    getValue = {
                        formViewModel.answers[it] ?: "No such key"
                    },
                    context = context
                )
            }
        }
    }
}

@SuppressLint("DiscouragedApi")
@Composable
fun FormItem(
    item: FormElement,
    onValueChange: (String, Any) -> Unit,
    onExpandedChange: (List<*>) -> Unit,
    onFilterChange: (List<*>) -> Unit,
    onErrorChange: (List<*>, List<*>) -> Unit,
    getValue: (String) -> Any,
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

        "image" -> {
            FormImage(
                imageId = context.resources.getIdentifier(item.contentId, "drawable", context.packageName),
                label = item.label
            )
        }

        "row" -> {
            FormRow(
                content = item.content,
                getValue = getValue,
                onValueChange = onValueChange,
                expanded = item.expanded,
                onExpandedChange = onExpandedChange,
                filter = item.filter,
                onFilterChange = onFilterChange,
                error = item.error,
                errorMessage = item.errorMessage,
                onErrorChange = onErrorChange,
                context = context,
                modifier = modifier
            )
        }

        "column" -> {
            FormColumn(
                content = item.content,
                getValue = getValue,
                onValueChange = onValueChange,
                expanded = item.expanded,
                onExpandedChange = onExpandedChange,
                filter = item.filter,
                onFilterChange = onFilterChange,
                error = item.error,
                errorMessage = item.errorMessage,
                onErrorChange = onErrorChange,
                context = context,
                modifier = modifier
            )
        }

        "text" -> {
            TextInput(
                value = getValue(item.name).toString(),
                onValueChange = { onValueChange(item.name, it) },
                placeholder = item.placeholder,
                label = item.label,
                modifier = modifier
            )
        }

        "textarea" -> {
            TextAreaInput(
                value = getValue(item.name).toString(),
                onValueChange = { onValueChange(item.name, it) },
                placeholder = item.placeholder,
                label = item.label,
                modifier = modifier
            )
        }

        "number" -> {
            NumberInput(
                value = getValue(item.name).toString().toIntOrNull() ?: 5,
                onValueChange = { onValueChange(item.name, it) },
                placeholder = item.placeholder,
                label = item.label,
                error = item.error[0].toString().toBooleanStrictOrNull() ?: true,
                errorMessage = item.errorMessage[0].toString(),
                onErrorChange = {it1, it2 -> onErrorChange(listOf(it1), listOf(it2)) },
                min = item.min.toIntOrNull() ?: -9999,
                max = item.max.toIntOrNull() ?: 9999,
                context = context,
                modifier = modifier
            )
        }

        "radio" -> {
            RadioInput(
                value = getValue(item.name).toString(),
                onValueChange = { onValueChange(item.name, it) },
                options = item.options,
                label = item.label,
                modifier = modifier
            )
        }

        "checkbox" -> {
            CheckboxInput(
                value = getValue(item.name).toString().toBooleanStrictOrNull() ?: true,
                onValueChange = { onValueChange(item.name, it) },
                label = item.label,
                modifier = modifier
            )
        }

        "dropdown" -> {
            DropdownInput(
                onValueChange = { onValueChange(item.name, it) },
                expanded = item.expanded[0].toString().toBooleanStrictOrNull() ?: true,
                onExpandedChange = { onExpandedChange(listOf(it)) },
                options = item.options,
                label = item.label,
                filter = item.filter[0].toString(),
                onFilterChange = { onFilterChange(listOf(it)) },
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
        modifier = modifier,
        style = MaterialTheme.typography.bodyLarge
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
fun FormImage(
    imageId: Int,
    label: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = Modifier
            .padding(bottom = dimensionResource(R.dimen.form_element_space))
            .fillMaxWidth()
    ) {
        if (label != "") { FormLabel(label = label) }
        Image(
            painter = painterResource(imageId),
            contentDescription = null,
            contentScale = ContentScale.FillWidth,
            modifier = modifier
        )
    }
}

@Composable
fun FormRow(
    content: List<FormElement>,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    expanded: List<*>,
    onExpandedChange: (List<*>) -> Unit,
    filter: List<*>,
    onFilterChange: (List<*>) -> Unit,
    error: List<*>,
    errorMessage: List<*>,
    onErrorChange: (List<*>, List<*>) -> Unit,
    context: Context,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
    ) {
        FormGroup(
            content = content,
            getValue = getValue,
            onValueChange = onValueChange,
            expanded = expanded,
            onExpandedChange = onExpandedChange,
            filter = filter,
            onFilterChange = onFilterChange,
            error = error,
            errorMessage = errorMessage,
            onErrorChange = onErrorChange,
            context = context,
            row = true,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
fun FormColumn(
    content: List<FormElement>,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    expanded: List<*>,
    onExpandedChange: (List<*>) -> Unit,
    filter: List<*>,
    onFilterChange: (List<*>) -> Unit,
    error: List<*>,
    errorMessage: List<*>,
    onErrorChange: (List<*>, List<*>) -> Unit,
    context: Context,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
    ) {
        FormGroup(
            content = content,
            getValue = getValue,
            onValueChange = onValueChange,
            expanded = expanded,
            onExpandedChange = onExpandedChange,
            filter = filter,
            onFilterChange = onFilterChange,
            error = error,
            errorMessage = errorMessage,
            onErrorChange = onErrorChange,
            row = false,
            context = context
        )
    }
}

@Composable
fun FormGroup(
    content: List<FormElement>,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    expanded: List<*>,
    onExpandedChange: (List<*>) -> Unit,
    filter: List<*>,
    onFilterChange: (List<*>) -> Unit,
    error: List<*>,
    errorMessage: List<*>,
    onErrorChange: (List<*>, List<*>) -> Unit,
    row: Boolean,
    context: Context,
    modifier: Modifier = Modifier
) {
    for (i in 0 until content.size) {
        FormItem(
            item = content[i],
            onValueChange = onValueChange,
            onExpandedChange = {
                var newExpanded = expanded.toMutableList()
                newExpanded[i] = it
                onExpandedChange(newExpanded)
            },
            onFilterChange = {
                var newFilter = filter.toMutableList()
                newFilter[i] = it
                onFilterChange(newFilter)
            },
            onErrorChange = { it1, it2 ->
                var newError = error.toMutableList()
                newError[i] = it1
                var newErrorMessage = errorMessage.toMutableList()
                newErrorMessage[i] = it2
                onErrorChange(newError, newErrorMessage)
            },
            getValue = getValue,
            context = context,
            modifier = modifier
        )
        if (row) {
            Spacer(modifier = Modifier.width(dimensionResource(R.dimen.margin)))
        }
    }
}

@Composable
fun TextInput(
    value: String,
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
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            placeholder = { Text(placeholder) },
            modifier = modifier.fillMaxWidth()
        )
    }
}

@Composable
fun TextAreaInput(
    value: String,
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
            value = value,
            onValueChange = onValueChange,
            singleLine = false,
            placeholder = { Text(placeholder) },
            modifier = modifier.fillMaxWidth()
        )
    }
}

@Composable
fun NumberInput(
    value: Int,
    onValueChange: (Any) -> Unit,
    placeholder: String,
    error: Boolean,
    errorMessage: String,
    onErrorChange: (Boolean, String) -> Unit,
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
                        onErrorChange(true, context.getString(R.string.minimum_value_is) + min)
                    } else if ((it.toIntOrNull() ?: 0) > max) {
                        onErrorChange(true, context.getString(R.string.maximum_value_is) + max)
                    } else if (error) {
                        onErrorChange(false, "")
                    }
                    onValueChange(it.toIntOrNull() ?: 0)
                },
                singleLine = true,
                placeholder = { Text(placeholder) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                isError = error,
                supportingText = { if (error) { Text(errorMessage) } },
                leadingIcon = {
                    IconButton(
                        onClick = { onValueChange(value - 1) },
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
                        onClick = { onValueChange(value + 1) },
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
    value: String,
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
                        modifier = Modifier.size(dimensionResource(R.dimen.option_button_size))
                    )
                    Spacer(modifier = Modifier.width(dimensionResource(R.dimen.option_label_space)))
                    Text(
                        text = j.label,
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            }
        }
    }
}

@Composable
fun CheckboxInput(
    value: Boolean,
    onValueChange: (Any) -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier.clickable { onValueChange(!value) }
    ) {
        Checkbox(
            checked = value,
            onCheckedChange = { onValueChange(!value) },
            modifier = Modifier.size(dimensionResource(R.dimen.option_button_size))
        )
        Spacer(modifier = Modifier.width(dimensionResource(R.dimen.option_label_space)))
        Text(
            text = label,
            style = MaterialTheme.typography.bodyLarge
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DropdownInput(
    onValueChange: (Any) -> Unit,
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
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
                expanded = expanded,
                onExpandedChange = { onExpandedChange(it) }
            ) {
                TextField(
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth(),
                    value = filter,
                    onValueChange = onFilterChange,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    colors = ExposedDropdownMenuDefaults.textFieldColors()
                )
                val filteringOptions = options.filter { it.label.contains(filter, ignoreCase = true) }
                if (filteringOptions.isNotEmpty()) {
                    ExposedDropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { onExpandedChange(false) }
                    ) {
                        filteringOptions.forEach { dropdownOption ->
                            DropdownMenuItem(
                                text = { Text(dropdownOption.label) },
                                onClick = {
                                    onValueChange(dropdownOption.value)
                                    onFilterChange(dropdownOption.label)
                                    onExpandedChange(false)
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