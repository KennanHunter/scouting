package com.example.isaproject

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SummaryScreen(
    formViewModel: FormViewModel,
    onPreviousButtonClicked: () -> Unit,
    onNewMatchButtonClicked: () -> Unit,
    onShareButtonClicked: () -> Unit,
    onQuickshareButtonClicked: () -> Unit,
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
                    formViewModel.setQrcodeDialog(true)
                    onShareButtonClicked()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = dimensionResource(R.dimen.margin))
            ) {
                Text(stringResource(R.string.submit_qrcode))
            }
            Button(
                onClick = {
                    formViewModel.setJsonDialog(true)
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
                    onClick = {
                        formViewModel.setNewMatchDialog(true)
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text(stringResource(R.string.new_match))
                }
            }
        }
        if (formViewModel.jsonDialog) {
            AlertDialog(
                onDismissRequest = { formViewModel.setJsonDialog(false) },
                confirmButton = {
                    TextButton(
                        onClick = { formViewModel.setJsonDialog(false) }
                    ) {
                        Text(stringResource(R.string.done))
                    }
                },
                text = {
                    Text(
                        text = formViewModel.answersJson,
                        style = MaterialTheme.typography.bodyLarge,
                        modifier = Modifier
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState())
                    )
                }
            )
        }
        if (formViewModel.qrcodeDialog) {
            AlertDialog(
                onDismissRequest = { formViewModel.setQrcodeDialog(false) },
                confirmButton = {
                    TextButton(
                        onClick = { formViewModel.setQrcodeDialog(false) }
                    ) {
                        Text(stringResource(R.string.done))
                    }
                },
                text = {
                    Image(
                        painter = rememberQrBitmapPainter(content = formViewModel.answersJson),
                        contentDescription = "Form results as a QR Code",
                        contentScale = ContentScale.FillWidth,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            )
        }
        if (formViewModel.newMatchDialog) {
            AlertDialog(
                onDismissRequest = {
                    formViewModel.setNewMatchDialog(false)
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            formViewModel.setNewMatchDialog(false)
                            onNewMatchButtonClicked()
                        }
                    ) {
                        Text(stringResource(R.string.yes))
                    }
                },
                dismissButton = {
                    TextButton(
                        onClick = {
                            formViewModel.setNewMatchDialog(false)
                        }
                    ) {
                        Text(stringResource(R.string.no))
                    }
                },
                title = {
                    Text(stringResource(R.string.new_match_confirmation_title))
                },
                text = {
                    Text(stringResource(R.string.new_match_confirmation_description))
                }
            )
        }
    }
}