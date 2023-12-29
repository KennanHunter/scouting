package com.example.isaproject

import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun FormScreen(
    formViewModel: FormViewModel,
    page: FormPage,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
    ) {
        items(
            items = page.page,
            key = { item -> item.name }
        ) {item ->
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