package com.example.isaproject

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SelectDeviceScreen(
    formViewModel: FormViewModel,
    onConnectButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            PageTitle(text = AppScreens.SelectDevice.label)
        },
        bottomBar = {
            BottomNavBar(
                canNavigateBack = false,
                nextButtonLabel = stringResource(R.string.connect),
                onNextButtonClicked = {
                    onConnectButtonClicked()
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = modifier
                .padding(innerPadding)
                .padding(dimensionResource(R.dimen.margin))
        ) {
            items(formViewModel.devices) { device ->
                DeviceListItem(
                    item = device,
                    currentDevice = formViewModel.currentDevice,
                    onValueChange = { formViewModel.setDevice(device) }
                )
            }
        }
    }
}

@Composable
fun DeviceListItem(
    item: Device,
    currentDevice: Device,
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
                text = item.name,
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = "id: ${item.id}",
                style = MaterialTheme.typography.labelMedium
            )
        }
        RadioButton(
            selected = item.id == currentDevice.id,
            onClick = onValueChange,
        )
    }
}