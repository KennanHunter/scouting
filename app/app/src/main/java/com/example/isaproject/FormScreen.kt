package com.example.isaproject

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.isaproject.ui.theme.ISAProjectTheme
import kotlinx.coroutines.flow.callbackFlow

@Composable
fun FormScreen(
    formViewModel: FormViewModel,
    page: FormPage,
    onNextButtonClicked: () -> Unit,
    onPreviousButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column() {
        Text(
            text = page.name,
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier
                .padding(all = dimensionResource(R.dimen.margin))
                .align(Alignment.CenterHorizontally)
        )
        LazyColumn(
            modifier = Modifier
                .weight(1f)
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
        Surface(
            color = MaterialTheme.colorScheme.surfaceContainer
        ) {
            Row {
                OutlinedButton(
                    onClick = onPreviousButtonClicked,
                    modifier = Modifier
                        .padding(all = dimensionResource(R.dimen.margin))
                        .weight(1f)
                ) {
                    Text(stringResource(R.string.previous))
                }
                Button(
                    onClick = onNextButtonClicked,
                    modifier = Modifier
                        .padding(all = dimensionResource(R.dimen.margin))
                        .weight(1f)
                ) {
                    Text(stringResource(R.string.next))
                }
            }
        }
    }
}