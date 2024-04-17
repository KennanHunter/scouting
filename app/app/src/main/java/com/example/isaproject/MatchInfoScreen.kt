package com.example.isaproject

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import kotlinx.coroutines.launch

@Composable
fun MatchInfoScreen(
    formViewModel: FormViewModel,
    onPreviousButtonClicked: () -> Unit,
    onNextButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }
    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            PageTitle(
                text = AppScreen.MatchInfo.label,
                nowScouting = formViewModel.teamNumber,
                position = formViewModel.position
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
        SingleEventEffect(formViewModel.sideEffectFlow) { sideEffect ->
            when (sideEffect) {
                is SideEffect.ShowToast -> scope.launch { snackbarHostState.showSnackbar(sideEffect.message) }
            }
        }

        Column(
            modifier = Modifier
                .padding(innerPadding)
                .padding(dimensionResource(R.dimen.margin))
                .fillMaxHeight()
        ) {
            var scoutTeamError by remember { mutableStateOf("") }
            var matchNumberError by remember { mutableStateOf("") }
            var teamNumberError by remember { mutableStateOf("") }

            Text(
                text = stringResource(R.string.scout_information),
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
            )
            TextInput(
                value = formViewModel.scoutName,
                onValueChange = { formViewModel.setScoutName(it.toString()) },
                placeholder = "",
                label = stringResource(R.string.scout_name)
            )
            NumberInput(
                value = formViewModel.scoutTeam,
                onValueChange = {formViewModel.setScoutTeam(it.toString().toIntOrNull() ?: 0)},
                label = "Scout Team Number",
                error = scoutTeamError,
                onErrorChange = { scoutTeamError = it },
                min = 0,
                useButtons = false,
                context = context
            )

            FormDivider()

            Text(
                text = stringResource(R.string.match_information),
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
            )
            Column(
                modifier = Modifier.padding(bottom = dimensionResource(R.dimen.form_element_space))
            ) {
                FormLabel(label = stringResource(R.string.match_number))
                Row {
                    TextField(
                        value = when (formViewModel.matchNumber) {
                            Int.MIN_VALUE -> "-"
                            Int.MAX_VALUE -> ""
                            else -> formViewModel.matchNumber.toString()
                        },
                        onValueChange = { newValue ->
                            formViewModel.setMatchNumber(
                                when (newValue) {
                                    "0-", "-" -> Int.MIN_VALUE
                                    ""        -> Int.MAX_VALUE
                                    else      -> {
                                        newValue.toIntOrNull() ?: if (formViewModel.matchNumber == Int.MAX_VALUE || formViewModel.matchNumber == Int.MIN_VALUE) {
                                            0
                                        } else {
                                            formViewModel.matchNumber
                                        }
                                    }
                                }
                            )
                            if (formViewModel.matches?.indexOfFirst { it.third == formViewModel.matchNumber } == -1) {
                                matchNumberError = context.getString(R.string.invalid_match_number)
                            } else if (matchNumberError != "") {
                                matchNumberError = ""
                            }
                        },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        isError = matchNumberError != "",
                        supportingText = { if (matchNumberError != "") { Text(matchNumberError) } },
                        leadingIcon = {
                            OutlinedIconButton(
                                onClick = {
                                    (
                                        if (formViewModel.matchNumber == Int.MIN_VALUE || formViewModel.matchNumber == Int.MAX_VALUE) {
                                            0
                                        } else {
                                            val index = formViewModel.matches?.indexOfFirst { it.third == formViewModel.matchNumber }
                                            if (index == -1 || index == 0) {
                                                formViewModel.matches?.get(0)?.third
                                            } else {
                                                if (index != null) {
                                                    formViewModel.matches?.get(index - 1)?.third
                                                } else { null }
                                            }
                                        }
                                    )?.let {
                                        formViewModel.setMatchNumber(it)
                                    }
                                },
                                modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Remove,
                                    contentDescription = "Minus 1",
                                )
                            }
                        },
                        trailingIcon = {
                            OutlinedIconButton(
                                onClick = {
                                    (
                                        if (formViewModel.matchNumber == Int.MIN_VALUE || formViewModel.matchNumber == Int.MAX_VALUE) {
                                            0
                                        } else {
                                            val index = formViewModel.matches?.indexOfFirst { it.third == formViewModel.matchNumber }
                                            if (index == -1) {
                                                formViewModel.matches?.get(0)?.third
                                            } else if (index == formViewModel.matches?.size?.minus(1)) {
                                                null
                                            } else {
                                                if (index != null) {
                                                    formViewModel.matches?.get(index + 1)?.third
                                                } else { null }
                                            }
                                        }
                                    )?.let {
                                        formViewModel.setMatchNumber(it)
                                    }
                                },
                                modifier = Modifier.size(dimensionResource(R.dimen.number_button_size))
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Add,
                                    contentDescription = "Plus 1",
                                )
                            }
                        },
                        colors = TextFieldDefaults.colors(
                            errorLeadingIconColor = TextFieldDefaults.colors().errorTrailingIconColor
                        ),
                        modifier = modifier.weight(1f)
                    )
                }
            }

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