package com.example.isaproject

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
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
            modifier = modifier.padding(innerPadding)
        ) {

        }
    }
}