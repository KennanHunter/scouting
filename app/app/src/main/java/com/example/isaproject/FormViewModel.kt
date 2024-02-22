package com.example.isaproject

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.pm.PackageManager
import androidx.compose.runtime.*
import androidx.core.app.ActivityCompat
import androidx.core.content.getSystemService
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json

@SuppressLint("MutableCollectionMutableState")
class FormViewModel : ViewModel() {
    private val serializedForm = Json.decodeFromString<List<SerializableFormPage>>(DataSource.formJSON)
    private fun scanForElementsWithId(element: SerializableFormElement, defaultId: Int) : Pair<List<Pair<SerializableFormElement, String>>, Int> {
        var newId = defaultId
        val result = mutableListOf<Pair<SerializableFormElement, String>>()
        if (element.name == "") {
            element.name = "noId${newId}"
            newId += 1
        }
        when (element.type) {
            "row", "column" -> {
                result.add(Pair(element, ""))
                element.children.forEach { it1 ->
                    if (it1.name == "") {
                        it1.name = "noId${newId}"
                        newId += 1
                    }
                    val elements = scanForElementsWithId(it1, newId)
                    elements.first.forEach { it2 ->
                        result.add(Pair(it2.first, it1.name))
                    }
                    newId = elements.second
                }
            }
            "conditional"   -> {
                result.add(Pair(element, ""))
                element.variants.forEach { it1 ->
                    if (it1.content.name == "") {
                        it1.content.name = "noId${newId}"
                        newId += 1
                    }
                    val elements = scanForElementsWithId(it1.content, newId)
                    elements.first.forEach { it2 ->
                        result.add(Pair(it2.first, it1.content.name))
                    }
                    newId = elements.second
                }
            }
            else            -> {
                result.add(Pair(element, ""))
            }
        }
        return Pair(result, newId)
    }
    private var _form : List<FormPage> = run {
        val result = mutableListOf<FormPage>()
        var defaultId = 0
        for (i in serializedForm) {
            val pageContent = mutableListOf<FormElement>()
            for (j in i.page) {
                val elements = scanForElementsWithId(j, defaultId)
                elements.first.forEach { (item, parent) ->
                    pageContent.add(
                        FormElement(
                            type = enumByNameIgnoreCase<FormElementType>(item.type) ?: FormElementType.Text,
                            name = item.name,
                            label = item.label,
                            placeholder = item.placeholder,
                            options = item.options,
                            columns = item.columns.toIntOrNull() ?: 1,
                            min = item.min.toIntOrNull() ?: Int.MIN_VALUE,
                            max = item.max.toIntOrNull() ?: Int.MAX_VALUE,
                            children = run {
                                val children = mutableListOf<String>()
                                for (k in item.children) {
                                    children.add(k.name)
                                }
                                children
                            },
                            isChild = parent != "",
                            content = item.content,
                            initialValue = item.initialValue,
                            useButtons = item.useButtons.toBooleanStrictOrNull() ?: true,
                            property = item.property,
                            variants = run {
                                val variants = mutableListOf<ConditionalVariant>()
                                for (k in item.variants) {
                                    variants.add(ConditionalVariant(k.value, k.content.name))
                                }
                                variants
                            },
                            exportAs = if (item.exportAs == "") {
                                when (item.type) {
                                    "number" -> DataType.Int
                                    "checkbox" -> DataType.Boolean
                                    else -> DataType.String
                                }
                            } else {
                                enumByNameIgnoreCase<DataType>(item.exportAs) ?: DataType.String
                            },
                            _filter = if (item.type == "number") { "0" } else { "" }
                        )
                    )
                }
                defaultId = elements.second
            }
            result.add(
                FormPage(
                    name = i.name,
                    page = pageContent
                )
            )
        }
        result
    }
    val form: List<FormPage>
        get() = _form

    private var _scouts: MutableList<String>? by mutableStateOf(null)
    val scouts: List<String>?
        get() = _scouts
    fun fetchScouts() {
        //TODO: send a request to relay computer for scout names
        val availableScouts = DataSource.scouts
        _scouts = availableScouts.toMutableList()
    }
    private var _currentScout by mutableStateOf("")
    val currentScout: String
        get() = _currentScout
    fun setCurrentScout(value: String) {
        _currentScout = value
    }

    private var _matchNumber by mutableIntStateOf(0)
    val matchNumber: Int
        get() = _matchNumber
    fun setMatchNumber(value: Int) {
        _matchNumber = value
    }

    private var _noShow by mutableStateOf(false)
    val noShow: Boolean
        get() = _noShow
    fun setNoShow(value: Boolean) {
        _noShow = value
    }

    fun setExpanded(page: String, item: String, expanded: Boolean) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.expanded = expanded
            }
        }
    }
    fun setFilter(page: String, item: String, filter: String) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.filter = filter
            }
        }
    }

    fun setError(page: String, item: String, errorMessage: String) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.error = errorMessage
            }
        }
    }


    private val _devices = Json.decodeFromString<List<Device>>(DataSource.deviceJSON.trimIndent()).toMutableStateList()
    val devices: List<Device>
        get() = _devices

    fun getAvailableDevices(context: Context) {
        if (!context.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH)) {
            throw Error("Bluetooth not allowed on system")
        }

        val bluetoothManager = context.getSystemService<BluetoothManager>()

        if (bluetoothManager !is BluetoothManager) {
            return
        }

        if (ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.BLUETOOTH_SCAN
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            throw Error("Bluetooth not granted")
        }

        bluetoothManager.adapter.startDiscovery()


    }

    private var _currentDevice by mutableStateOf(Device("", ""))
    val currentDevice: Device
        get() = _currentDevice
    fun setDevice(device: Device) {
        _currentDevice = if (device.id != "") {
            _devices.first { it.id == device.id }
        } else {
            Device("", "")
        }
    }

    private var _currentPosition by mutableStateOf(Position.None)
    val currentPosition: Position
        get() = _currentPosition
    fun setPosition(position: Position) {
        _currentPosition = position
    }

    private var _fieldOrientation by mutableStateOf(FieldOrientation.None)
    val fieldOrientation: FieldOrientation
        get() = _fieldOrientation
    fun setFieldOrientation(pos: FieldOrientation) {
        _fieldOrientation = pos
    }

    private var _connectionStatus by mutableStateOf(ConnectionStatus.NOT_CONNECTED)
    val connectionStatus: ConnectionStatus
        get() = _connectionStatus

    fun setConnectionStatus(status: ConnectionStatus) {
        _connectionStatus = status
    }

    private fun initAnswers(): MutableMap<String, Any> {
        val result = mutableStateMapOf<String, Any>()
        for (i in form) {
            for (j in i.page) {
                if (j.name != "" && "noId" !in j.name) {
                    result[j.name] = if (j.initialValue == "") {
                        when (j.type) {
                            FormElementType.Number -> 0
                            FormElementType.Checkbox -> false
                            else -> j.initialValue.toIntOrNull() ?: j.initialValue.toBooleanStrictOrNull() ?: j.initialValue
                        }
                    } else {
                        j.initialValue
                    } as Any
                }
            }
        }
        return result
    }
    private var _answers = initAnswers()
    val answers: Map<String, Any>
        get() {
            return _answers
        }
    fun setAnswer(name: String, value: Any) {
        _answers[name] = value
    }

    fun cleanAnswers() {
        for (i in answers) {
            if (i.value is Int) {
                if (i.value == Int.MIN_VALUE || i.value == Int.MAX_VALUE) {
                    _answers[i.key] = 0
                }
            }
        }
        _answers.putAll(mapOf(
            "position" to currentPosition.name,
            "scoutname" to currentScout,
            "matchnumber" to matchNumber,
            "teamnumber" to (teamNumber ?: 0),
            "noshow" to noShow
        ))
    }
    fun resetForm() {
        val matchNumber = (_answers["matchnumber"].toString().toIntOrNull() ?: 0) + 1
        _answers = initAnswers()
        _matchNumber += 1
        _noShow = false
        setAnswer("matchnumber", matchNumber)
    }

    val answersJson: String
        get() {
            return answers.entries.toSortedSet(compareBy { it.key }).joinToString(
                prefix = "{\n",
                postfix = "\n}",
                separator = ",\n"
            ) {
                "    \"" + it.key + "\": " + if (it.value is Int || it.value is Boolean) { "" } else { "\"" } + it.value.toString() + if (it.value is Int || it.value is Boolean) { "" } else { "\"" }
            }
        }


    private val _sideEffectChannel = Channel<SideEffect>(capacity = Channel.BUFFERED)
    val sideEffectFlow: Flow<SideEffect>
        get() = _sideEffectChannel.receiveAsFlow()

    fun sendEvent(evt: SideEffect) {
        viewModelScope.launch {
            _sideEffectChannel.send(evt)
        }
    }

    val teamNumber: Int?
        get() = matches?.let {
            if (matchNumber > 0 && matchNumber <= it.size) {
                when (currentPosition) {
                    Position.Red1  -> it[matchNumber - 1].first.first
                    Position.Red2  -> it[matchNumber - 1].first.second
                    Position.Red3  -> it[matchNumber - 1].first.third
                    Position.Blue1 -> it[matchNumber - 1].second.first
                    Position.Blue2 -> it[matchNumber - 1].second.second
                    Position.Blue3 -> it[matchNumber - 1].second.third
                    else           -> null
                }
            } else {
                null
            }
        }

    operator fun get(key: String): Any? {
        return when (key) {
            "form" -> form
            "devices" -> devices
            "currentDevice" -> currentDevice
            "currentPosition" -> currentPosition
            "scoutPos" -> fieldOrientation
            "connectionStatus" -> connectionStatus
            "answers" -> answers
            "answersJson" -> answersJson
            "teamNumber" -> teamNumber
            else -> null
        }
    }

    private var _eventCode by mutableStateOf("")
    val eventCode: String
        get() = _eventCode
    fun setEventCode(code: String) {
        _eventCode = code
    }

    private var _matches: List<Pair<Triple<Int, Int, Int>, Triple<Int, Int, Int>>>? by mutableStateOf(null)
    val matches: List<Pair<Triple<Int, Int, Int>, Triple<Int, Int, Int>>>?
        get() = _matches
    fun fetchMatches() {
        //TODO: implement code for getting matches from API
        _matches = if (eventCode == "test") {
            listOf(
                Pair(
                    Triple(78, 3494, 1501),
                    Triple(8564, 256, 119)
                ),
                Pair(
                    Triple(3452, 45, 756),
                    Triple(2547, 7678, 234)
                ),
                Pair(
                    Triple(4678, 2346, 7345),
                    Triple(4836, 1563, 8136)
                )
            )
        } else { null }
    }
}