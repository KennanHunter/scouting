package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SummaryScreen(
    onPreviousButtonClicked: () -> Unit,
    onSubmitButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(all = dimensionResource(R.dimen.margin))
    ) {
        Text(
            text = "Congrats. You finished the form.",
            modifier = Modifier.weight(1f)
        )
        Row(
            modifier = modifier
        ) {
            OutlinedButton(
                onClick = onPreviousButtonClicked,
                modifier = Modifier
                    .padding(horizontal = dimensionResource(R.dimen.margin))
                    .weight(1f)
            ) {
                Text(stringResource(R.string.previous))
            }
            Button(
                onClick = onSubmitButtonClicked,
                modifier = Modifier
                    .padding(horizontal = dimensionResource(R.dimen.margin))
                    .weight(1f)
            ) {
                Text(stringResource(R.string.submit))
            }
        }
    }
}