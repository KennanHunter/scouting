package com.example.isaproject

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import androidx.compose.runtime.*
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.request
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import java.io.File
import javax.inject.Inject
import kotlin.collections.set

@SuppressLint("MutableCollectionMutableState")
class FormViewModel @Inject constructor(
    context: Context
) : ViewModel() {
    @SuppressLint("StaticFieldLeak")
    private val context2 = context


    private val _sideEffectChannel = Channel<SideEffect>(capacity = Channel.BUFFERED)
    val sideEffectFlow: Flow<SideEffect>
        get() = _sideEffectChannel.receiveAsFlow()

    fun sendEvent(evt: SideEffect) {
        viewModelScope.launch {
            _sideEffectChannel.send(evt)
        }
    }


    private var _connectionStatus by mutableStateOf(ConnectionStatus.NOT_CONNECTED)
    val connectionStatus: ConnectionStatus
        get() = _connectionStatus
    fun setConnectionStatus(status: ConnectionStatus) {
        _connectionStatus = status
    }


    private var _position by mutableStateOf(Position.None)
    val position: Position
        get() = _position
    fun setPosition(position: Position) {
        _position = position
    }

    private var _fieldOrientation by mutableStateOf(FieldOrientation.None)
    val fieldOrientation: FieldOrientation
        get() = _fieldOrientation
    fun setFieldOrientation(pos: FieldOrientation) {
        _fieldOrientation = pos
    }

    private var _eventCode by mutableStateOf("")
    val eventCode: String
        get() = _eventCode
    fun setEventCode(code: String) {
        _eventCode = code
    }

    private var _matches: List<Triple<Triple<Int?, Int?, Int?>, Triple<Int?, Int?, Int?>, Int>>? by mutableStateOf(null)
    val matches: List<Triple<Triple<Int?, Int?, Int?>, Triple<Int?, Int?, Int?>, Int>>?
        get() = _matches
    fun fetchMatches() {
        setEventCode(eventCode.trim())

        val client = HttpClient(CIO)

        //TODO: implement code for getting matches from API
        _matches = if (eventCode == "test") {
            listOf(
                Triple(
                    Triple(78, 3494, 1501), Triple(8564, 256, 119), 1
                ), Triple(
                    Triple(3452, 45, 756), Triple(2547, 7678, 234), 2
                ), Triple(
                    Triple(4678, 2346, 7345), Triple(4836, 1563, 8136), 3
                )
            )
        } else {
            val stringResponse = if (File(context2.filesDir, "${eventCode}.txt").exists()) {
                File(context2.filesDir, "${eventCode}.txt").readText()
            } else {
                try {
                    runBlocking {
                        val response = client.request("https://api.scout.kennan.tech/graphql/") {
                            method = HttpMethod.Post
                            setBody("{ \"query\": \"{ getEvent(key: \\\"${eventCode}\\\") { matches { matchKey, matchNumber, matchEntries { teamNumber, alliance }}}}\" }")
                            contentType(ContentType.Application.Json)
                        }

                        if (!response.status.isSuccess()) {
                            SideEffect.ShowToast("API Match Schedule Sync failed")
                            return@runBlocking null
                        }

                        val responseBody: String = response.body()
                        Log.d("GqlResponse", responseBody)

                        File(context2.filesDir, "${eventCode}.txt").writeText(responseBody)

                        responseBody
                    }
                } catch (ex: Exception) {
                    ex.printStackTrace()
                    return
                }
            }
            val parsedResponse = stringResponse?.let { nonNullResponse ->
                try {
                    Json.decodeFromString<MatchDataA>(nonNullResponse).data.getEvent.matches.sortedBy {
                        extractMatchNumberFromKey(it.matchKey)
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    null
                }
            } ?: run {
                return
            }

            Log.d("GqlResponse", parsedResponse.toString())
            val finalResponse = mutableListOf<Triple<Triple<Int?, Int?, Int?>, Triple<Int?, Int?, Int?>, Int>>()

            for (i in parsedResponse) {
                val red = mutableListOf<Int>()
                val blue = mutableListOf<Int>()
                for (j in i.matchEntries) {
                    when (j.alliance) {
                        "red"  -> red.add(j.teamNumber)
                        "blue" -> blue.add(j.teamNumber)
                    }
                }
                finalResponse.add(
                    Triple(
                        Triple(red.getOrNull(0), red.getOrNull(1), red.getOrNull(2)),
                        Triple(blue.getOrNull(0), blue.getOrNull(1), blue.getOrNull(2)),
                        i.matchNumber
                    )
                )
            }
            finalResponse
        }
    }

//    private val _devices = Json.decodeFromString<List<Device>>(DataSource.deviceJSON.trimIndent()).toMutableStateList()
//    val devices: List<Device>
//        get() = _devices
//    fun getAvailableDevices(context: Context) {
//        if (!context.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH)) {
//            throw Error("Bluetooth not allowed on system")
//        }
//
//        val bluetoothManager = context.getSystemService<BluetoothManager>()
//        if (bluetoothManager !is BluetoothManager) {
//            return
//        }
//
//        if (ActivityCompat.checkSelfPermission(
//                context, Manifest.permission.BLUETOOTH_SCAN
//            ) != PackageManager.PERMISSION_GRANTED
//        ) {
//            throw Error("Bluetooth not granted")
//        }
//
//        bluetoothManager.adapter.startDiscovery()
//    }

//    private var _currentDevice by mutableStateOf(Device("", ""))
//    val currentDevice: Device
//        get() = _currentDevice
//    fun setCurrentDevice(device: Device) {
//        _currentDevice = if (device.id != "") {
//            _devices.first { it.id == device.id }
//        } else {
//            Device("", "")
//        }
//    }

    private var _scoutName by mutableStateOf("")
    val scoutName: String
        get() = _scoutName
    fun setScoutName(value: String) {
        _scoutName = value
    }

    private var _scoutTeam by mutableIntStateOf(Int.MAX_VALUE)
    val scoutTeam: Int
        get() = _scoutTeam
    fun setScoutTeam(value: Int) {
        _scoutTeam = value
    }

    private var _matchNumber by mutableIntStateOf(0)
    val matchNumber: Int
        get() = _matchNumber
    fun setMatchNumber(value: Int) {
        _matchNumber = value
    }

    private var _teamNumber by mutableStateOf("")
    val teamNumber: Int?
        get() = matches?.let {
            if (matchNumber > 0 && matchNumber <= it.size) {
                when (position) {
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
        } ?: _teamNumber.toIntOrNull()
    fun setTeamNumber(value: String) {
        _teamNumber = value
    }

    private var _noShow by mutableStateOf(false)
    val noShow: Boolean
        get() = _noShow
    fun setNoShow(value: Boolean) {
        _noShow = value
    }


    private val serializedForm = run {
        val jsonString = context.assets.open("Form.json").bufferedReader().use { it.readText() }
        val gson = Gson()
        gson.fromJson(jsonString, SerializableForm::class.java)
    }.form

    private fun scanForElementsWithId(
        element: SerializableFormElement,
        defaultId: Int
    ): Pair<List<Pair<SerializableFormElement, String>>, Int> {
        var newId = defaultId
        val result = mutableListOf<Pair<SerializableFormElement, String>>()
        if (element.name == null || element.name == "") {
            element.name = "noId${newId}"
            newId += 1
        }
        when (element.type) {
            "row", "column" -> {
                result.add(Pair(element, ""))
                element.children?.forEach { it1 ->
                    if (it1.name == "") {
                        it1.name = "noId${newId}"
                        newId += 1
                    }
                    val elements = scanForElementsWithId(it1, newId)
                    elements.first.forEach { it2 ->
                        result.add(
                            it1.name?.let {
                                Pair(it2.first, it)
                            } ?: run {
                                newId += 1
                                Pair(it2.first, "noId${newId - 1}")
                            }
                        )
                    }
                    newId = elements.second
                }
            }

            "conditional"   -> {
                result.add(Pair(element, ""))
                element.variants?.forEach { it1 ->
                    if (it1.content.name == "") {
                        it1.content.name = "noId${newId}"
                        newId += 1
                    }
                    val elements = scanForElementsWithId(it1.content, newId)
                    elements.first.forEach { it2 ->
                        result.add(
                            it1.content.name?.let {
                                Pair(it2.first, it)
                            } ?: run {
                                newId += 1
                                Pair(it2.first, "noId${newId - 1}")
                            }
                        )
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

    private var _form: List<FormPage> = run {
        val result = mutableListOf<FormPage>()
        var defaultId = 0
        for (i in serializedForm) {
            val pageContent = mutableListOf<FormElement>()
            for (j in i.page) {
                val elements = scanForElementsWithId(j, defaultId)
                elements.first.forEach { (item, parent) ->
                    Log.d("Form.json", item.toString())
                    pageContent.add(
                        FormElement(
                            type = enumByNameIgnoreCase<FormElementType>(item.type) ?: FormElementType.Text,
                            name = item.name ?: "",
                            label = item.label ?: "",
                            placeholder = item.placeholder ?: "",
                            options = item.options ?: listOf(),
                            columns = item.columns?.toIntOrNull() ?: 1,
                            min = item.min?.toIntOrNull() ?: Int.MIN_VALUE,
                            max = item.max?.toIntOrNull() ?: Int.MAX_VALUE,
                            children = run {
                                val children = mutableListOf<String>()
                                for (k in item.children ?: listOf()) {
                                    k.name?.let { children.add(it) }
                                }
                                children
                            },
                            isChild = parent != "",
                            content = item.content ?: "",
                            initialValue = item.initialValue ?: "",
                            useButtons = item.useButtons?.toBooleanStrictOrNull() ?: true,
                            property = item.property ?: "",
                            variants = run {
                                val variants = mutableListOf<ConditionalVariant>()
                                for (k in item.variants ?: listOf()) {
                                    k.content.name?.let { variants.add(ConditionalVariant(k.value, it)) }
                                }
                                variants
                            },
                            exportAs = if (item.exportAs == null) {
                                when (item.type) {
                                    "number"   -> DataType.Int
                                    "checkbox" -> DataType.Boolean
                                    else       -> DataType.String
                                }
                            } else {
                                enumByNameIgnoreCase<DataType>(item.exportAs) ?: DataType.String
                            },
                            _filter = if (item.type == "number") {
                                "0"
                            } else {
                                ""
                            }
                        )
                    )
                }
                defaultId = elements.second
            }
            result.add(
                FormPage(
                    name = i.name, page = pageContent
                )
            )
        }
        result
    }
    val form: List<FormPage>
        get() = _form


    fun setExpanded(
        page: String,
        item: String,
        expanded: Boolean
    ) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.expanded = expanded
            }
        }
    }

    fun setFilter(
        page: String,
        item: String,
        filter: String
    ) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.filter = filter
            }
        }
    }

    fun setError(
        page: String,
        item: String,
        errorMessage: String
    ) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.error = errorMessage
            }
        }
    }

    fun setSelected(
        page: String,
        item: String,
        selected: Boolean
    ) {
        _form.find { it.name == page }?.let { i ->
            i.page.find { it.name == item }?.let { j ->
                j.selected = selected
            }
        }
    }


    private fun initAnswers(): MutableMap<String, Any> {
        val result = mutableStateMapOf<String, Any>()
        for (i in form) {
            for (j in i.page) {
                if (j.name != "" && "noId" !in j.name) {
                    result[j.name] = if (j.initialValue == "") {
                        when (j.type) {
                            FormElementType.Number   -> 0
                            FormElementType.Checkbox -> false
                            else                     -> j.initialValue.toIntOrNull() ?: j.initialValue.toBooleanStrictOrNull() ?: j.initialValue
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
    fun setAnswer(
        name: String,
        value: Any
    ) {
        _answers[name] = value
    }

    val answersJson: String
        get() {
            return (
                    answers +
                            ("position" to position.name) +
                            ("scoutname" to "$scoutName ($scoutTeam)") +
                            ("matchnumber" to matchNumber) +
                            ("teamnumber" to (teamNumber ?: 0)) +
                            ("noshow" to noShow)
            ).entries.toSortedSet(compareBy { it.key }).joinToString(
                prefix = "{\n", postfix = "\n}", separator = ",\n"
            ) {
                val element: FormElement? = run {
                    for (j in form) {
                        for (k in j.page) {
                            if (k.name == it.key) return@run k
                        }
                    }
                    return@run null
                }
                var value = it.value
                if (value is Int && (value == Int.MIN_VALUE || value == Int.MAX_VALUE)) {
                    value = 0
                }
                if (element != null && value::class.simpleName != element.exportAs.name) {
                    value = when (element.exportAs) {
                        DataType.Int     -> when (value) {
                            is Boolean -> if (value) 1 else 0
                            is String  -> value.toIntOrNull() ?: 0
                            else       -> value.toString().toIntOrNull() ?: 0
                        }

                        DataType.Boolean -> when (value) {
                            is Int    -> value > 0
                            is String -> value.toBooleanStrictOrNull() ?: false
                            else      -> value.toString().toBooleanStrictOrNull() ?: false
                        }

                        DataType.String  -> value.toString()
                    }
                }
                Log.d("AnswersJson", it.key + " " + value.toString() + " " + value::class.simpleName)

                "    \"" + it.key + "\": " +
                        if (value is String) { "\"" } else { "" } +
                        value.toString() +
                        if (value is String) { "\"" } else { "" }
            }
        }

    fun resetForm() {
        _answers = initAnswers()
        _matchNumber = run {
            if (matchNumber == Int.MIN_VALUE || matchNumber == Int.MAX_VALUE) {
                null
            } else {
                val index = matches?.indexOfFirst { it.third == matchNumber }
                if (index == -1) {
                    matches?.get(0)?.third
                } else if (index == matches?.size?.minus(1)) {
                    null
                } else {
                    if (index != null) {
                        matches?.get(index + 1)?.third
                    } else {
                        null
                    }
                }
            }
        } ?: (matchNumber + 1)
        _noShow = false
        setAnswer("matchnumber", matchNumber)
    }


    operator fun get(key: String): Any? {
        return when (key) {
            "form"             -> form
//            "devices"          -> devices
//            "currentDevice"    -> currentDevice
            "currentPosition"  -> position
            "scoutPos"         -> fieldOrientation
            "connectionStatus" -> connectionStatus
            "answers"          -> answers
            "answersJson"      -> answersJson
            "teamNumber"       -> teamNumber
            "eventCode"        -> eventCode
            "matches"          -> matches
            else               -> null
        }
    }
}

class FormViewModelFactory(private val applicationContext: Context) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(FormViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return FormViewModel(applicationContext) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}