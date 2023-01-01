package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PageTitle(
    text: String,
    modifier: Modifier = Modifier,
    nowScouting: String = ""
) {
    TopAppBar(
        title = {
            Column {
                Text(text = text)
                if (nowScouting != "") {
                    Text(
                        text = stringResource(R.string.now_scouting) + nowScouting,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.primary,
            titleContentColor = MaterialTheme.colorScheme.onPrimary
        ),
        modifier = modifier
    )
}

@Composable
fun BottomNavBar(
    buttons: List<Triple<() -> Unit, String, ButtonType>>,
    modifier: Modifier = Modifier
) {
    BottomAppBar(
        modifier = modifier
    ) {
        Row {
            for (it in buttons) {
                when (it.third) {
                    ButtonType.Outlined -> {
                        OutlinedButton(
                            onClick = it.first,
                            modifier = Modifier
                                .padding(all = dimensionResource(R.dimen.margin))
                                .weight(1f)
                        ) {
                            Text(it.second)
                        }
                    }
                    ButtonType.Filled -> {
                        Button(
                            onClick = it.first,
                            modifier = Modifier
                                .padding(all = dimensionResource(R.dimen.margin))
                                .weight(1f)
                        ) {
                            Text(it.second)
                        }
                    }
                }
            }
        }
    }
}