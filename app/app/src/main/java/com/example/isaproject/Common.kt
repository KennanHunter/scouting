package com.example.isaproject

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.repeatOnLifecycle
import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable

enum class ConnectionStatus {
    CONNECTED,
    NOT_CONNECTED,
    CONNECTING,
    ERROR
}

sealed interface SideEffect {
    data class ShowToast(val message: String) : SideEffect
}

enum class AppScreen(val label: String) {
    SetupDevice("Setup Device"),
    Loading("Loading"),
    MatchInfo("Part 0: Match Information"),
    Summary("Summary")
}

enum class Position(val label: String) {
    Red1("Red 1"),
    Red2("Red 2"),
    Red3("Red 3"),
    Blue1("Blue 1"),
    Blue2("Blue 2"),
    Blue3("Blue 3"),
    None("No Position Selected")
}

enum class FieldOrientation(val label: String) {
    A("Source Side"),
    B("Amp Side"),
    None("No Position Selected")
}

enum class DataType {
    Int,
    String,
    Boolean
}

@Serializable
data class SerializableFormPage(
    val name: String,
    val page: List<SerializableFormElement>
)

@Serializable
data class SerializableFormElement(
    val type: String,
    var name: String = "",
    val label: String = "",
    val placeholder: String = "",
    var options: List<FormOption> = listOf(),
    val columns: String = "1",
    val min: String = "",
    val max: String = "",
    val children: List<SerializableFormElement> = listOf(),
    val content: String = "",
    var initialValue: String = "",
    val useButtons: String = "true",
    val property: String = "",
    val exportAs: String = "",
    val variants: List<SerializableConditionalVariant> = listOf()
)

@Serializable
data class SerializableConditionalVariant(
    val value: String,
    val content: SerializableFormElement
)

enum class FormElementType {
    Label,
    Divider,
    Spacer,
    Image,
    Row,
    Column,
    Text,
    TextArea,
    Number,
    Radio,
    Checkbox,
    Dropdown,
    Conditional
}

data class FormPage(
    val name: String,
    val page: List<FormElement>
)

data class FormElement(
    val type: FormElementType,
    val name: String,
    val label: String,
    val placeholder: String,
    var options: List<FormOption>,
    val columns: Int,
    val min: Int,
    val max: Int,
    val children: List<String>,
    val isChild: Boolean,
    val content: String,
    val initialValue: String,
    val useButtons: Boolean,
    val property: String,
    val variants: List<ConditionalVariant>,
    val exportAs: DataType,
    private val _expanded: Boolean = false,
    private val _filter: String = "",
    private val _error: String = ""
) {
    var expanded by mutableStateOf(_expanded)
    var filter by mutableStateOf(_filter)
    var error by mutableStateOf(_error)
}

@Serializable
data class FormOption(
    val value: String,
    val label: String
)

data class ConditionalVariant(
    val value: String,
    val content: String
)

@Serializable
data class Device(
    val id: String,
    val name: String
)

enum class ButtonType {
    Outlined,
    Filled
}

@Composable
fun <T : Any> SingleEventEffect(
    sideEffectFlow: Flow<T>,
    lifeCycleState: Lifecycle.State = Lifecycle.State.STARTED,
    collector: (T) -> Unit
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(sideEffectFlow) {
        lifecycleOwner.repeatOnLifecycle(lifeCycleState) {
            sideEffectFlow.collect(collector)
        }
    }
}

// From Baeldung
inline fun <reified T : Enum<T>> enumByNameIgnoreCase(input: String, default: T? = null): T? {
    return enumValues<T>().firstOrNull { it.name.equals(input, true) } ?: default
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PageTitle(
    text: String,
    modifier: Modifier = Modifier,
    position: Position = Position.None,
    nowScouting: Int? = null,
) {
    TopAppBar(
        title = {
            Text(text = text)
        },
        actions = {
            if (nowScouting != null || position != Position.None) {
                Button(
                    onClick = {},
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer,
                        contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                    ),
                    modifier = Modifier.padding(end = dimensionResource(R.dimen.margin))
                ) {
                    Text(
                        text = stringResource(
                            R.string.now_scouting,
                            if (nowScouting != null && nowScouting != Int.MAX_VALUE && nowScouting != Int.MIN_VALUE) {
                                nowScouting.toString()
                            } else {
                                "-"
                            },
                            if (position != Position.None) {
                                position.label
                            } else {
                                "-"
                            }
                        ),
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