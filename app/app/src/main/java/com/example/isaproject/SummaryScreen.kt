package com.example.isaproject

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp

@Composable
fun SummaryScreen(
    formViewModel: FormViewModel,
    onPreviousButtonClicked: () -> Unit,
    onNewMatchButtonClicked: () -> Unit,
    onShareButtonClicked: () -> Unit,
    onQuickshareButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    var jsonDialog by remember { mutableStateOf(false) }
    var qrCodeDialog by remember { mutableStateOf(false) }
    var newMatchDialog by remember { mutableStateOf(false) }
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
                        { newMatchDialog = true },
                        stringResource(R.string.new_match),
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
                    qrCodeDialog = true
                    onShareButtonClicked()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = dimensionResource(R.dimen.margin))
            ) {
                Text(stringResource(R.string.submit_qrcode))
            }
            Button(
                onClick = { jsonDialog = true },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = dimensionResource(R.dimen.margin))
            ) {
                Text(stringResource(R.string.preview_json))
            }
        }
        if (jsonDialog) {
            AlertDialog(
                onDismissRequest = { jsonDialog = false },
                confirmButton = {
                    TextButton(
                        onClick = { jsonDialog = false }
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
        if (qrCodeDialog) {
            AlertDialog(
                onDismissRequest = { qrCodeDialog = false },
                confirmButton = {
                    TextButton(
                        onClick = { qrCodeDialog = false }
                    ) {
                        Text(stringResource(R.string.done))
                    }
                },
                text = {
                    Image(
                        painter = rememberQrBitmapPainter(
                            content = formViewModel.answersJson,
                            padding = 0.dp,
                            size = 350.dp
                        ),
                        contentDescription = "Form results as a QR Code",
                        contentScale = ContentScale.FillWidth,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            )
        }
        if (newMatchDialog) {
            AlertDialog(
                onDismissRequest = { newMatchDialog = false },
                confirmButton = {
                    TextButton(
                        onClick = {
                            newMatchDialog = false
                            onNewMatchButtonClicked()
                        }
                    ) {
                        Text(stringResource(R.string.yes))
                    }
                },
                dismissButton = {
                    TextButton(
                        onClick = { newMatchDialog = false }
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