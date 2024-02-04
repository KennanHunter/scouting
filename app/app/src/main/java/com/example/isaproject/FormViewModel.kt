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
    private var _form : List<FormPage> = Json.decodeFromString<List<FormPage>>(DataSource.formJSON.trimIndent()).toMutableStateList()
    val form: List<FormPage>
        get() = _form

    fun getScouts() {
        //TODO: send a request to relay computer for scout names
        val scouts = Json.decodeFromString<List<FormOption>>(DataSource.scoutsJSON.trimIndent())
        _form.find { it.name == "prematch" }?.let { i ->
            i.page.find { it.name == "scoutname" }?.let { j ->
                j.options = scouts
            }
        }
    }

    fun setValue(page: FormPage, item: FormElement, value: String) {
        _form.find { it.name == page.name }?.let { i ->
            i.page.find { it.name == item.name }?.let { j ->
                j.value = value
            }
        }
    }

    fun setExpanded(page: FormPage, item: FormElement, expanded: String) {
        _form.find { it.name == page.name }?.let { i ->
            i.page.find { it.name == item.name }?.let { j ->
                j.expanded = expanded
            }
        }
    }
    fun setFilter(page: FormPage, item: FormElement, filter: String) {
        _form.find { it.name == page.name }?.let { i ->
            i.page.find { it.name == item.name }?.let { j ->
                j.filter = filter
            }
        }
    }

    fun setError(page: FormPage, item: FormElement, error: String, errorText: String) {
        _form.find { it.name == page.name }?.let { i ->
            i.page.find { it.name == item.name }?.let { j ->
                j.error = error
                j.errorMessage = errorText
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


    private var _answers = mutableStateMapOf<String, Any>()
    val answers: Map<String, Any>
        get() {
            if (_answers.size == 0) {
                for (i in form) {
                    for (j in i.page) {
                        if (j.name != "") {
                            _answers[j.name] =
                                j.value.toIntOrNull() ?: j.value.toBooleanStrictOrNull() ?: j.value
                        }
                    }
                }
            }
            return _answers
        }


    fun setAnswer(name: String, value: Any) {
        _answers[name] = value
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

    private var _buttonPresses = listOf<ButtonPress>().toMutableStateList()
    val buttonPresses: List<ButtonPress>
        get() = _buttonPresses
    fun addButtonPress(button: String, time: String) {
        _buttonPresses.add(ButtonPress(button, time))
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