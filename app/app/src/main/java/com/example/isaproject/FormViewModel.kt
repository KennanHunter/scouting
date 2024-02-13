package com.example.isaproject

import android.Manifest
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.pm.PackageManager
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.toMutableStateList
import androidx.core.app.ActivityCompat
import androidx.core.content.getSystemService
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json

class FormViewModel : ViewModel() {
    private val serializedForm = Json.decodeFromString<List<SerializableFormPage>>(DataSource.formJSON.trimIndent())
    private fun scanForElementsWithId(element: SerializableFormElement, defaultId: Int) : Pair<List<Pair<SerializableFormElement, String>>, Int> {
        var newId = defaultId
        val result = mutableListOf<Pair<SerializableFormElement, String>>()
        if (element.name == "") {
            element.name = "noId${newId}"
            newId += 1
        }
        if (element.type == "row" || element.type == "column") {
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
        } else {
            result.add(Pair(element, ""))
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
                            content = item.content
                        )
                    )
                }
                defaultId = elements.second
            }
            result.add(
                FormPage(
                    name = i.name,
                    label = i.label,
                    page = pageContent
                )
            )
        }
        result
    }
    val form: List<FormPage>
        get() = _form

    fun getScouts() {
        //TODO: send a request to relay computer for scout names
        val scouts = Json.decodeFromString<List<FormOption>>(DataSource.scoutsJSON.trimIndent())
        _form.find { it.name == "prematch" }?.let { it ->
            it.page.find { it.name == "scoutname" }?.let {
                it.options = scouts
            }
        }
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


    private val _devices =
        Json.decodeFromString<List<Device>>(DataSource.deviceJSON.trimIndent()).toMutableStateList()
    val devices: List<Device>
        get() = _devices

    fun fetchAvailableDevices(context: Context) {
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
        _currentDevice = _devices.first { it.id == device.id }
    }

    private var _connectionStatus by mutableStateOf(ConnectionStatus.NOT_CONNECTED)
    val connectionStatus: ConnectionStatus
        get() = _connectionStatus

    fun setConnectionStatus(status: ConnectionStatus) {
        _connectionStatus = status
    }


    private fun scanForElements(element: SerializableFormElement) : List<SerializableFormElement> {
        val result = mutableListOf<SerializableFormElement>()
        if (element.type == "row" || element.type == "column") {
            element.children.forEach { it1 ->
                scanForElements(it1).forEach { it2 ->
                    result.add(it2)
                }
            }
        } else {
            result.add(element)
        }
        return result
    }
    private var _answers = run {
        val result = mutableStateMapOf<String, Any>()
        for (i in serializedForm) {
            for (j in i.page) {
                scanForElements(j).forEach {
                    if (it.name != "" && "noId" !in it.name) { result[it.name] = it.value[0] as Any }
                }
            }
        }
        result
    }
    val answers: Map<String, Any>
        get() {
            return _answers
        }

    fun setAnswer(name: String, value: Any) {
        _answers[name] = value
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

    private var _nowScouting by mutableStateOf("")
    val nowScouting: String
        get() = _nowScouting

    fun getNowScouting(matchNumber: Number) {
        //TODO: send a request to relay computer for team number based on match number
        val team = DataSource.nowScouting
        _nowScouting = team
    }
}

//TODO: probably pick different names for statuses
enum class ConnectionStatus {
    CONNECTED,
    NOT_CONNECTED,
    CONNECTING,
    ERROR
}

sealed interface SideEffect {
    data class ShowToast(val message: String) : SideEffect
}