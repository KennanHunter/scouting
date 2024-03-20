package com.example.isaproject

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.provider.MediaStore
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.FileProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import java.io.File
import java.io.FileOutputStream

@Composable
fun ISAScreen(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
) {
    val context = LocalContext.current
    val formViewModel: FormViewModel = viewModel(
        factory = FormViewModelFactory(context.applicationContext)
    )
    NavHost(
            navController = navController,
            startDestination = AppScreen.SetupDevice.name,
            modifier = modifier
    ) {
        composable(route = AppScreen.SetupDevice.name) {
            DeviceSetupScreen(
                formViewModel = formViewModel,
                onConnectButtonClicked = {
                    formViewModel.fetchScouts()
//                  if (formViewModel.currentDevice.id == "") {
//                      formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.no_device_selected)))
//                      return@DeviceSetupScreen
//                  }
                    if (formViewModel.currentPosition == Position.None) {
                        formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.no_position_selected)))
                        return@DeviceSetupScreen
                    }
                    if (formViewModel.fieldOrientation == FieldOrientation.None) {
                        formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.no_scout_location_selected)))
                        return@DeviceSetupScreen
                    }
                    formViewModel.fetchMatches()
                    if (formViewModel.matches == null && formViewModel.eventCode != "") {
                        formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.invalid_event_code)))
                        return@DeviceSetupScreen
                    }

                    // TODO: make the ConnectionStatus CONNECTING
                    formViewModel.setConnectionStatus(ConnectionStatus.CONNECTED)
                    //TODO: Code for connecting to the selected device

                    navController.navigate(AppScreen.Loading.name)
                }
            )
        }
        composable(route = AppScreen.Loading.name) {
            LoadingScreen(
                formViewModel = formViewModel,
                onConnectionSuccess = {
                    navController.navigate(AppScreen.MatchInfo.name)
                },
                onConnectionFail = { navController.navigate(AppScreen.SetupDevice.name) }
            )
        }
        composable(route = AppScreen.MatchInfo.name) {
            MatchInfoScreen(
                formViewModel = formViewModel,
                onPreviousButtonClicked = { navController.navigate(AppScreen.SetupDevice.name) },
                onNextButtonClicked = {
                    if (formViewModel.currentScout == "") {
                        formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.no_scout_name_selected)))
                    } else if (formViewModel.matches?.indexOfFirst { it.third == formViewModel.matchNumber } == -1) {
                        formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.invalid_match_number)))
                    } else if (formViewModel.teamNumber == 0) {
                        formViewModel.sendEvent(SideEffect.ShowToast(context.getString(R.string.no_team_number_selected)))
                    } else {
                        if (formViewModel.noShow) {
                            navController.navigate(AppScreen.Summary.name)
                        } else {
                            navController.navigate(formViewModel.form[0].name)
                        }
                    }
                }
            )
        }
        for (i in 0 until formViewModel.form.size) {
            composable(route = formViewModel.form[i].name) {
                FormScreen(
                    formViewModel = formViewModel,
                    page = formViewModel.form[i].name,
                    onNextButtonClicked = {
                        if (i == formViewModel.form.size - 1) {
                            navController.navigate(AppScreen.Summary.name)
                        } else {
                            navController.navigate(formViewModel.form[i + 1].name)
                        }
                    },
                    onPreviousButtonClicked = {
                        if (i == 0) {
                            navController.popBackStack(AppScreen.MatchInfo.name, inclusive = false)
                        } else {
                            navController.navigateUp()
                        }
                    }
                )
            }
        }
        composable(route = AppScreen.Summary.name) {
            SummaryScreen(
                formViewModel = formViewModel,
                onPreviousButtonClicked = {
                    //TODO: send data to relay via Bluetooth
                    navController.navigateUp()
                },
                onNewMatchButtonClicked = {
                    formViewModel.resetForm()
                    navController.popBackStack(AppScreen.MatchInfo.name, inclusive = false)
                },
                onShareButtonClicked = {
                    val activity = context as? Activity
                    val content = formViewModel.answersJson.toByteArray()
                    val filename = context.getString(
                        R.string.isa_json,
                        formViewModel.eventCode,
                        formViewModel.matchNumber,
                        formViewModel.currentPosition.name,
                        formViewModel.teamNumber ?: 0
                    )

                    val contentValues = ContentValues().apply {
                        put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                    }
                    val downloadUri = context.applicationContext.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                    if (downloadUri != null) {
                        val outputStream = context.applicationContext.contentResolver.openOutputStream(downloadUri)
                        outputStream?.use {
                            it.write(content)
                        }
                        val downloadIntent = Intent(Intent.ACTION_VIEW).apply {
                            type = "application/json"
                            putExtra(Intent.EXTRA_STREAM, downloadUri)
                        }

                        try {
                            // DO NOT REMOVE THE FOLLOWING LINE!!!!! The app will crash otherwise
//                            context.startActivity(downloadIntent)
                            activity?.startActivity(downloadIntent)
                        } catch (e: Exception) {
                            Log.e("JsonExport", "Error downloading JSON file", e)
                        }
                    }
                },
                onQuickshareButtonClicked = {
                    val content = formViewModel.answersJson.toByteArray()
                    val filename = context.getString(
                        R.string.isa_json,
                        formViewModel.eventCode,
                        formViewModel.matchNumber,
                        formViewModel.currentPosition.name,
                        formViewModel.teamNumber ?: 0
                    )

                    val sendDirectory = File(context.filesDir, "shared_files")
                    if (!sendDirectory.exists()) { sendDirectory.mkdirs() }
                    val sendFile = File(sendDirectory, filename)
                    sendFile.parentFile?.mkdirs()
                    FileOutputStream(sendFile).use {
                        it.write(content)
                    }
                    val uri = FileProvider.getUriForFile(context, context.applicationContext.packageName + ".provider", sendFile)
                    val sendIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "application/json"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    try {
                        context.startActivity(Intent.createChooser(sendIntent, "Share JSON File"))
                    } catch (e: Exception) {
                        Log.e("JsonExport", "Error sharing JSON file", e)
                    }
                }
            )
        }
    }
}