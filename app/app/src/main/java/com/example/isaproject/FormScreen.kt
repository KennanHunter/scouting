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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Checkbox
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedIconButton
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
    page: String,
    onNextButtonClicked: () -> Unit,
    onPreviousButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    Scaffold(
        topBar = {
            formViewModel.form.find { it.name == page }?.let {
                PageTitle(
                    text = it.label,
                    nowScouting = formViewModel.nowScouting,
                    position = formViewModel.currentPosition
                )
            }
        },
        bottomBar = {
            BottomNavBar(
                buttons = listOf(
                    Triple(
                        onPreviousButtonClicked,
                        stringResource(R.string.previous),
                        ButtonType.Outlined
                    ),
                    Triple(
                        onNextButtonClicked,
                        stringResource(R.string.next),
                        ButtonType.Filled
                    )
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .padding(innerPadding)
                .padding(all = dimensionResource(R.dimen.margin))
        ) {
            formViewModel.form.find { it.name == page }?.let { it ->
                items(it.page) { item ->
                    if (!item.isChild) {
                        FormItem(
                            item = item,
                            onValueChange = { name, value ->
                                formViewModel.setAnswer(name, value)
                            },
                            onExpandedChange = { itemName, it ->
                                formViewModel.setExpanded(page, itemName, it)
                            },
                            onFilterChange = { itemName, it ->
                                formViewModel.setFilter(page, itemName, it)
                            },
                            onErrorChange = { itemName, it ->
                                formViewModel.setError(page, itemName, it)
                            },
                            getValue = {
                                formViewModel.answers[it] ?: "No such key"
                            },
                            getElement = { itemName ->
                                formViewModel.form.find { it.name == page }?.page?.find { it.name == itemName }
                            },
                            getData = {
                                formViewModel[it]
                            },
                            context = context
                        )
                    }
                }
            }
        }
    }
}

@SuppressLint("DiscouragedApi")
@Composable
fun FormItem(
    item: FormElement,
    onValueChange: (String, Any) -> Unit,
    onExpandedChange: (String, Boolean) -> Unit,
    onFilterChange: (String, String) -> Unit,
    onErrorChange: (String, String) -> Unit,
    getValue: (String) -> Any,
    getElement: (String) -> FormElement?,
    getData: (String) -> Any?,
    context: Context,
    modifier: Modifier = Modifier
) {
    when (item.type) {
        FormElementType.Label -> {
            FormLabel(
                label = item.label,
                modifier = modifier
            )
        }

        FormElementType.Divider -> {
            FormDivider(
                modifier = modifier
            )
        }

        FormElementType.Spacer -> {
            FormSpace(
                modifier = modifier
            )
        }

        FormElementType.Image -> {
            FormImage(
                imageId = context.resources.getIdentifier(item.content, "drawable", context.packageName),
                label = item.label
            )
        }

        FormElementType.Row -> {
            FormRow(
                children = item.children,
                getValue = getValue,
                onValueChange = onValueChange,
                onExpandedChange = onExpandedChange,
                onFilterChange = onFilterChange,
                onErrorChange = onErrorChange,
                getElement = getElement,
                getData = getData,
                context = context,
                modifier = modifier
            )
        }

        FormElementType.Column -> {
            FormColumn(
                children = item.children,
                getValue = getValue,
                onValueChange = onValueChange,
                onExpandedChange = onExpandedChange,
                onFilterChange = onFilterChange,
                onErrorChange = onErrorChange,
                getElement = getElement,
                getData = getData,
                context = context,
                modifier = modifier
            )
        }

        FormElementType.Conditional -> {
            FormConditional(
                property = item.property,
                variants = item.variants,
                getElement = getElement,
                getData = getData,
                getValue = getValue,
                onValueChange = onValueChange,
                onExpandedChange = onExpandedChange,
                onFilterChange = onFilterChange,
                onErrorChange = onErrorChange,
                context = context,
                modifier = modifier
            )
        }

        FormElementType.Text -> {
            TextInput(
                value = getValue(item.name).toString(),
                onValueChange = { onValueChange(item.name, it) },
                placeholder = item.placeholder,
                label = item.label,
                modifier = modifier
            )
        }

        FormElementType.TextArea -> {
            TextAreaInput(
                value = getValue(item.name).toString(),
                onValueChange = { onValueChange(item.name, it) },
                placeholder = item.placeholder,
                label = item.label,
                modifier = modifier
            )
        }

        FormElementType.Number -> {
            NumberInput(
                value = getValue(item.name).toString().toIntOrNull() ?: -9999,
                onValueChange = { onValueChange(item.name, it) },
                placeholder = item.placeholder,
                label = item.label,
                error = item.error,
                onErrorChange = { onErrorChange(item.name, it) },
                min = item.min,
                max = item.max,
                context = context,
                useButtons = item.useButtons,
                modifier = modifier
            )
        }

        FormElementType.Radio -> {
            RadioInput(
                value = getValue(item.name).toString(),
                onValueChange = { onValueChange(item.name, it) },
                options = item.options,
                columns = item.columns,
                label = item.label,
                modifier = modifier
            )
        }

        FormElementType.Checkbox -> {
            CheckboxInput(
                value = getValue(item.name).toString().toBooleanStrictOrNull() ?: true,
                onValueChange = { onValueChange(item.name, it) },
                label = item.label,
                modifier = modifier
            )
        }

        FormElementType.Dropdown -> {
            DropdownInput(
                onValueChange = { onValueChange(item.name, it) },
                expanded = item.expanded,
                onExpandedChange = { onExpandedChange(item.name, it) },
                options = item.options,
                label = item.label,
                filter = item.filter,
                onFilterChange = { onFilterChange(item.name, it) },
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
            modifier = modifier.fillMaxWidth()
        )
    }
}

@Composable
fun FormRow(
    children: List<String>,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    onExpandedChange: (String, Boolean) -> Unit,
    onFilterChange: (String, String) -> Unit,
    onErrorChange: (String, String) -> Unit,
    getElement: (String) -> FormElement?,
    getData: (String) -> Any?,
    context: Context,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
    ) {
        FormGroup(
            children = children,
            getValue = getValue,
            onValueChange = onValueChange,
            onExpandedChange = onExpandedChange,
            onFilterChange = onFilterChange,
            onErrorChange = onErrorChange,
            row = true,
            getElement = getElement,
            getData = getData,
            modifier = Modifier.weight(1f),
            context = context,
        )
    }
}

@Composable
fun FormColumn(
    children: List<String>,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    onExpandedChange: (String, Boolean) -> Unit,
    onFilterChange: (String, String) -> Unit,
    onErrorChange: (String, String) -> Unit,
    getElement: (String) -> FormElement?,
    getData: (String) -> Any?,
    context: Context,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
    ) {
        FormGroup(
            children = children,
            getValue = getValue,
            onValueChange = onValueChange,
            onExpandedChange = onExpandedChange,
            onFilterChange = onFilterChange,
            onErrorChange = onErrorChange,
            row = false,
            getElement = getElement,
            getData = getData,
            context = context
        )
    }
}

@Composable
fun FormGroup(
    children: List<String>,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    onExpandedChange: (String, Boolean) -> Unit,
    onFilterChange: (String, String) -> Unit,
    onErrorChange: (String, String) -> Unit,
    row: Boolean,
    getElement: (String) -> FormElement?,
    getData: (String) -> Any?,
    context: Context,
    modifier: Modifier = Modifier
) {
    for (i in children) {
        val item = getElement(i)
        if (item != null) {
            FormItem(
                item = item,
                onValueChange = onValueChange,
                onExpandedChange = onExpandedChange,
                onFilterChange = onFilterChange,
                onErrorChange = onErrorChange,
                getValue = getValue,
                context = context,
                getElement = getElement,
                getData = getData,
                modifier = modifier
            )
            if (row) {
                Spacer(modifier = Modifier.width(dimensionResource(R.dimen.margin)))
            }
        } else {
            Text(text = "getElement() failed")
        }
    }
}

@Composable
fun FormConditional(
    property: String,
    variants: List<ConditionalVariant>,
    getElement: (String) -> FormElement?,
    getData: (String) -> Any?,
    getValue: (String) -> Any,
    onValueChange: (String, Any) -> Unit,
    onExpandedChange: (String, Boolean) -> Unit,
    onFilterChange: (String, String) -> Unit,
    onErrorChange: (String, String) -> Unit,
    context: Context,
    modifier: Modifier = Modifier
) {
    val data = getData(property).toString()
    for (i in variants) {
        if (i.value == data) {
            getElement(i.content)?.let {
                FormItem(
                    item = it,
                    onValueChange = onValueChange,
                    onExpandedChange = onExpandedChange,
                    onFilterChange = onFilterChange,
                    onErrorChange = onErrorChange,
                    getValue = getValue,
                    context = context,
                    getElement = getElement,
                    getData = getData,
                    modifier = modifier
                )
            }
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
    error: String,
    onErrorChange: (String) -> Unit,
    min: Int,
    max: Int,
    label: String,
    useButtons: Boolean,
    context: Context,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") {
            FormLabel(label = label)
        }
        Row {
            TextField(
                value = when (value) {
                    Int.MIN_VALUE -> "-"
                    Int.MAX_VALUE -> ""
                    else -> value.toString()
                },
                onValueChange = {
                    if (it == "0-" || it == "-") {
                        onValueChange(Int.MIN_VALUE)
                    } else if (it == "") {
                        onValueChange(Int.MAX_VALUE)
                    } else {
                        val newValue = it.toIntOrNull() ?: if (value == Int.MAX_VALUE || value == Int.MIN_VALUE) {
                            0
                        } else {
                            value
                        }
                        onValueChange(newValue)
                        if (newValue < min) {
                            onErrorChange(context.getString(R.string.minimum_value_is, min.toString()))
                        } else if (newValue > max) {
                            onErrorChange(context.getString(R.string.maximum_value_is, max.toString()))
                        } else if (error != "") { onErrorChange("") }
                    }
                },
                singleLine = true,
                placeholder = { Text(placeholder) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                isError = error != "",
                supportingText = { if (error != "") { Text(error) } },
                leadingIcon = if (useButtons) {
                    {
                        OutlinedIconButton(
                            onClick = {
                                val newValue = if (value == Int.MIN_VALUE || value == Int.MAX_VALUE) {
                                    0
                                } else {
                                    value - 1
                                }
                                onValueChange(newValue)
                                if (newValue < min) {
                                    onErrorChange(context.getString(R.string.minimum_value_is, min.toString()))
                                } else if (error != "") {
                                    onErrorChange("")
                                }
                            },
                            modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Remove,
                                contentDescription = "Minus 1",
                            )
                        }
                    }
                } else { null },
                trailingIcon = if (useButtons) {
                    {
                        OutlinedIconButton(
                            onClick = {
                                val newValue = if (value == Int.MIN_VALUE || value == Int.MAX_VALUE) {
                                    0
                                } else {
                                    value + 1
                                }
                                onValueChange(newValue)
                                if (newValue > max) {
                                    onErrorChange(context.getString(R.string.minimum_value_is, min.toString()))
                                } else if (error != "") {
                                    onErrorChange("")
                                }
                            },
                            modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Plus 1",
                            )
                        }
                    }
                } else { null },
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
    columns: Int,
    modifier: Modifier = Modifier,
    label: String
) {
    Column(
        modifier = modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
    ) {
        if (label != "") {
            FormLabel(label = label)
        }
        Row {
            for (i in 0 until columns) {
                if (i != 0) { Spacer(modifier = Modifier.width(dimensionResource(R.dimen.lr_option_space))) }
                Column {
                    for (j in options.subList(i * (options.size / columns), (i + 1) * (options.size / columns))) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .padding(bottom = dimensionResource(R.dimen.option_space))
                                .clickable {
                                    if (j.value == value) {
                                        onValueChange("")
                                    } else {
                                        onValueChange(j.value)
                                    }
                                }
                        ) {
                            RadioButton(
                                selected = j.value == value,
                                onClick = {
                                    if (j.value == value) {
                                        onValueChange("")
                                    } else {
                                        onValueChange(j.value)
                                    }
                                },
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
                    colors = ExposedDropdownMenuDefaults.textFieldColors(),
                    singleLine = true
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