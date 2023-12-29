package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SelectDeviceScreen(
    formViewModel: FormViewModel,
    onConnectButtonClicked: () -> Unit
) {
    Column() {
        Surface(
            color = MaterialTheme.colorScheme.surfaceContainer
        ) {
            Button(
                onClick = { /*TODO*/ },
                modifier = Modifier
                    .padding(all = dimensionResource(R.dimen.margin))
                    .weight(1f)
            ) {
                Text(stringResource(R.string.connect))
            }
        }
    }
}