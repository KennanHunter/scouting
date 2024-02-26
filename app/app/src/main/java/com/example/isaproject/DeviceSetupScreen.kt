package com.example.isaproject

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import kotlinx.coroutines.launch

@Composable
fun DeviceSetupScreen(
    formViewModel: FormViewModel,
    onConnectButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }
    val context = LocalContext.current
    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = { PageTitle(text = AppScreen.SetupDevice.label) },
        bottomBar = {
            BottomNavBar(
                buttons = listOf(
                    Triple(
                        onConnectButtonClicked,
                        stringResource(R.string.connect),
                        ButtonType.Filled
                    )
                )
            )
        }
    ) { innerPadding ->
        SingleEventEffect(formViewModel.sideEffectFlow) { sideEffect ->
            when (sideEffect) {
                is SideEffect.ShowToast -> scope.launch { snackbarHostState.showSnackbar(sideEffect.message) }
            }
        }
        Column(
            modifier = modifier
                .padding(innerPadding)
                .padding(dimensionResource(R.dimen.margin))
                .verticalScroll(rememberScrollState())
        ) {
//            Text(
//                text = stringResource(R.string.select_device),
//                style = MaterialTheme.typography.headlineMedium
//            )
//            Column {
//                for (i in formViewModel.devices) {
//                    //TODO: remove "Select any device to continue"
//                    DeviceListItem(
//                        label = i.name,
//                        current = formViewModel.currentDevice.name,
//                        subtext = stringResource(R.string.id_subtext, i.id),
//                        onValueChange = {
//                            if (formViewModel.currentDevice != i) {
//                                formViewModel.setDevice(i)
//                            } else {
//                                formViewModel.setDevice(Device("", ""))
//                            }
//                        }
//                    )
//                }
//            }
//            FormDivider()
            Text(
                text = stringResource(R.string.scouter_position),
                style = MaterialTheme.typography.headlineMedium
            )
            Column {
                for (i in Position.entries) {
                    if (i != Position.None) {
                        DeviceListItem(
                            label = i.label,
                            current = formViewModel.currentPosition.label,
                            subtext = "",
                            onValueChange = {
                                if (formViewModel.currentPosition != i) {
                                    formViewModel.setPosition(i)
                                } else {
                                    formViewModel.setPosition(Position.None)
                                }
                            }
                        )
                    }
                }
            }
            FormDivider()
            Text(
                text = stringResource(R.string.field_orientation),
                style = MaterialTheme.typography.headlineMedium
            )
            Column {
                for (i in FieldOrientation.entries) {
                    if (i != FieldOrientation.None) {
                        DeviceListItem(
                            label = i.label,
                            current = formViewModel.fieldOrientation.label,
                            subtext = "",
                            onValueChange = {
                                if (formViewModel.fieldOrientation != i) {
                                    formViewModel.setFieldOrientation(i)
                                } else {
                                    formViewModel.setFieldOrientation(FieldOrientation.None)
                                }
                            }
                        )
                    }
                }
            }
            FormDivider()
            Text(
                text = "Event Code",
                style = MaterialTheme.typography.headlineMedium
            )
            TextField(
                value = formViewModel.eventCode,
                onValueChange = { formViewModel.setEventCode(it) },
                singleLine = true,
                supportingText = {
                    Text("Leave this field blank to manually input team numbers")
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
fun DeviceListItem(
    label: String,
    current: String,
    subtext: String,
    onValueChange: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .padding(bottom = dimensionResource(R.dimen.select_device_space))
            .clickable(onClick = onValueChange),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.titleMedium
            )
            if (subtext != "") {
                Text(
                    text = subtext,
                    style = MaterialTheme.typography.labelMedium
                )
            }
        }
        RadioButton(
            selected = label == current,
            onClick = onValueChange,
        )
    }
}