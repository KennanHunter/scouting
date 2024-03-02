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
            var scoutsExpanded by remember { mutableStateOf(false) }
            var scoutsFilter by remember { mutableStateOf(formViewModel.currentScout) }
            var matchNumberError by remember { mutableStateOf("") }
            var teamNumberError by remember { mutableStateOf("") }
            formViewModel.scouts?.let { scouts ->
                DropdownInput(
                    onValueChange = { formViewModel.setCurrentScout(it.toString()) },
                    expanded = scoutsExpanded,
                    onExpandedChange = { scoutsExpanded = it },
                    options = scouts.map { FormOption(it, it) },
                    label = stringResource(R.string.scout_name),
                    filter = scoutsFilter,
                    onFilterChange = { scoutsFilter = it }
                )
            } ?: run {
                Text(
                    text = "formViewModel.getScouts() failed"
                )
            }
            NumberInput(
                value = formViewModel.matchNumber,
                onValueChange = { formViewModel.setMatchNumber(it.toString().toIntOrNull() ?: 0) },
                error = matchNumberError,
                onErrorChange = { matchNumberError = it },
                min = 0,
                max = 200,
                label = stringResource(R.string.match_number),
                useButtons = true,
                context = context
            )
            if (formViewModel.eventCode != "") {
                if (formViewModel.teamNumber != null) {
                    Text(
                        text = stringResource(R.string.team_number_is, formViewModel.teamNumber?.toString() ?: ""),
                        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
                    )
                } else {
                    Text(
                        text = stringResource(R.string.team_number_is, ""),
                        modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
                    )
                }
            } else {
                NumberInput(
                    value = formViewModel.teamNumber ?: Int.MAX_VALUE,
                    onValueChange = { formViewModel.setTeamNumber(it.toString()) },
                    error = teamNumberError,
                    onErrorChange = { teamNumberError = it },
                    min = 0,
                    max = 99999,
                    label = stringResource(R.string.team_number),
                    useButtons = false,
                    context = context
                )
            }
            CheckboxInput(
                value = formViewModel.noShow,
                onValueChange = { formViewModel.setNoShow(it.toString().toBooleanStrictOrNull() ?: false) },
                label = stringResource(R.string.no_show),
            )
        }
    }
}