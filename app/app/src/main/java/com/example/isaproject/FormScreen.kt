package com.example.isaproject

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun FormScreen(
    formViewModel: FormViewModel,
    page: FormPage,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = Modifier.padding(all = dimensionResource(R.dimen.margin))
    ) {
        LazyColumn(
            modifier = modifier.weight(1f)
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
        BottomBar(
            onNextButtonClicked = { /*TODO*/ },
            onPreviousButtonClicked = { /*TODO*/ }
        )
    }
}