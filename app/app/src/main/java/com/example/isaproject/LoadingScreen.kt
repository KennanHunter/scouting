package com.example.isaproject

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import kotlinx.coroutines.launch

@Composable
fun LoadingScreen(
    formViewModel: FormViewModel,
    onConnectionSuccess: () -> Unit,
    onConnectionFail: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }
    val context = LocalContext.current
    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        bottomBar = {
            BottomNavBar(
                buttons = listOf(
                    Triple(
                        {
                            formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.connection_failed)))
                            formViewModel.setConnectionStatus(ConnectionStatus.ERROR)
                        },
                        "Fail",
                        ButtonType.Outlined
                    ),
                    Triple(
                        {
                            formViewModel.setConnectionStatus(ConnectionStatus.CONNECTED)
                        },
                        "Success",
                        ButtonType.Filled
                    )
                )
            )
        },
        modifier = modifier
    ) { innerPadding ->
        when (formViewModel.connectionStatus) {
            ConnectionStatus.CONNECTING -> {
                Column(
                    modifier = Modifier
                        .padding(innerPadding)
                        .padding(dimensionResource(R.dimen.margin))
                        .fillMaxHeight(),
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = stringResource(R.string.loading),
                        style = MaterialTheme.typography.displaySmall,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Text(
                        text = stringResource(R.string.connecting_to_device) + formViewModel.currentDevice.name,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            ConnectionStatus.CONNECTED -> {
                onConnectionSuccess()
            }

            ConnectionStatus.NOT_CONNECTED, ConnectionStatus.ERROR -> {
                scope.launch { snackbarHostState.showSnackbar(context.getString(R.string.connection_error)) }
                onConnectionFail()
            }
        }
    }
}