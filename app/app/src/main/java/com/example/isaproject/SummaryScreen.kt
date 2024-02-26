package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SummaryScreen(
    formViewModel: FormViewModel,
    onPreviousButtonClicked: () -> Unit,
    onSubmitButtonClicked: () -> Unit,
    onShareButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            PageTitle(text = AppScreen.Summary.label)
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
                        onShareButtonClicked,
                        stringResource(R.string.download_json),
                        ButtonType.Filled
                    ),
                    Triple(
                        onSubmitButtonClicked,
                        stringResource(R.string.submit),
                        ButtonType.Filled
                    )
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .padding(all = dimensionResource(R.dimen.margin))
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = formViewModel.answersJson,
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}