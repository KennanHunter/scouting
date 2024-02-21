package com.example.isaproject

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun MatchInfoScreen(
    formViewModel: FormViewModel,
    onPreviousButtonClicked: () -> Unit,
    onNextButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    Scaffold(
        topBar = {
            PageTitle(
                text = AppScreen.MatchInfo.label,
                nowScouting = formViewModel.teamNumber,
                position = formViewModel.currentPosition
            )
        },
        bottomBar = {
            BottomNavBar(
                buttons = listOf(
                    Triple(
                        onPreviousButtonClicked,
                        context.getString(R.string.previous),
                        ButtonType.Outlined
                    ),
                    Triple(
                        onNextButtonClicked,
                        context.getString(R.string.next),
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
                .padding(dimensionResource(R.dimen.margin))
                .fillMaxHeight()
        ) {
            var expanded by remember { mutableStateOf(false) }
            var filter by remember { mutableStateOf("") }
            var error by remember { mutableStateOf("") }
            formViewModel.scouts?.let { scouts ->
                DropdownInput(
                    onValueChange = { formViewModel.setCurrentScout(it.toString()) },
                    expanded = expanded,
                    onExpandedChange = { expanded = it },
                    options = scouts.map { FormOption(it, it) },
                    label = stringResource(R.string.scout_name),
                    filter = filter,
                    onFilterChange = { filter = it }
                )
            } ?: run {
                Text(
                    text = "formViewModel.getScouts() failed"
                )
            }
            NumberInput(
                value = formViewModel.matchNumber,
                onValueChange = { formViewModel.setMatchNumber(it.toString().toIntOrNull() ?: 0) },
                placeholder = "",
                error = error,
                onErrorChange = { error = it },
                min = 0,
                max = 200,
                label = stringResource(R.string.match_number),
                useButtons = true,
                context = context
            )
            TextInput(
                value = formViewModel.teamNumber?.toString() ?: "",
                onValueChange = {},
                placeholder = "",
                label = "Team Number",
                enabled = false
            )
            CheckboxInput(
                value = formViewModel.noShow,
                onValueChange = { formViewModel.setNoShow(it.toString().toBooleanStrictOrNull() ?: false) },
                label = stringResource(R.string.no_show),
            )
        }
    }
}