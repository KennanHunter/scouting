package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
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

@Composable
fun SummaryScreen(
    onPreviousButtonClicked: () -> Unit,
    onSubmitButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column() {
        Text(
            text = "Congrats. You finished the form.",
            style = MaterialTheme.typography.displayLarge,
            modifier = Modifier
                .weight(1f)
                .align(Alignment.CenterHorizontally)
                .padding(all = dimensionResource(R.dimen.margin))
        )
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
                    onClick = onSubmitButtonClicked,
                    modifier = Modifier
                        .padding(all = dimensionResource(R.dimen.margin))
                        .weight(1f)
                ) {
                    Text(stringResource(R.string.submit))
                }
            }
        }
    }
}