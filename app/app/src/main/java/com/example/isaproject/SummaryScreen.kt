package com.example.isaproject

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SummaryScreen(
    formViewModel: FormViewModel,
    onPreviousButtonClicked: () -> Unit,
    onNewMatchButtonClicked: () -> Unit,
    onShareButtonClicked: () -> Unit,
    onQuickshareButtonClicked: () -> Unit,
    onQrcodeButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            PageTitle(text = AppScreen.Summary.label)
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .padding(all = dimensionResource(R.dimen.margin))
                .fillMaxHeight()
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.SpaceEvenly,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(
                onClick = {
                    onShareButtonClicked()
                    onQuickshareButtonClicked()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = dimensionResource(R.dimen.margin))
            ) {
                Text(stringResource(R.string.submit_quickshare))
            }
            Button(
                onClick = {
                    onShareButtonClicked()
                    onQrcodeButtonClicked()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = dimensionResource(R.dimen.margin))
            ) {
                Text(stringResource(R.string.submit_qrcode))
            }
            Button(
                onClick = {
                    /*TODO*/
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = dimensionResource(R.dimen.margin))
            ) {
                Text(stringResource(R.string.preview_json))
            }
            Row {
                OutlinedButton(
                    onClick = onPreviousButtonClicked,
                    modifier = Modifier.weight(1f)
                ) {
                    Text(stringResource(R.string.previous))
                }
                Spacer(
                    modifier = Modifier.width(dimensionResource(R.dimen.margin))
                )
                Button(
                    onClick = onNewMatchButtonClicked,
                    modifier = Modifier.weight(1f)
                ) {
                    Text(stringResource(R.string.new_match))
                }
            }
//            Text(
//                text = formViewModel.answersJson,
//                style = MaterialTheme.typography.bodyLarge,
//                modifier = Modifier.fillMaxWidth()
//            )
        }
    }
}