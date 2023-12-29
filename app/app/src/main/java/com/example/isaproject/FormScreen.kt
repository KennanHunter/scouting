package com.example.isaproject

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun FormScreen(
    formViewModel: FormViewModel,
    page: FormPage,
    onNextButtonClicked: () -> Unit,
    onPreviousButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(all = dimensionResource(R.dimen.margin))
    ) {
        LazyColumn(
            modifier = Modifier.weight(1f)
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
        Row(
            modifier = modifier
        ) {
            OutlinedButton(
                onClick = onPreviousButtonClicked,
                modifier = Modifier
                    .padding(horizontal = dimensionResource(R.dimen.margin))
                    .weight(1f)
            ) {
                Text(stringResource(R.string.previous))
            }
            Button(
                onClick = onNextButtonClicked,
                modifier = Modifier
                    .padding(horizontal = dimensionResource(R.dimen.margin))
                    .weight(1f)
            ) {
                Text(stringResource(R.string.next))
            }
        }
    }
}