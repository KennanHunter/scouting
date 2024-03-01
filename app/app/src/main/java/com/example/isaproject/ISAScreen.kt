package com.example.isaproject

import android.content.Intent
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
import java.io.IOException
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Composable
fun ISAScreen(
    modifier: Modifier = Modifier,
    formViewModel: FormViewModel = viewModel(),
    navController: NavHostController = rememberNavController()
) {
    val context = LocalContext.current
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
                    if (formViewModel.noShow) {
                        navController.navigate(AppScreen.Summary.name)
                    } else {
                        navController.navigate(formViewModel.form[0].name)
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
                onSubmitButtonClicked = {
                    formViewModel.resetForm()
                    navController.popBackStack(AppScreen.MatchInfo.name, inclusive = false)
                },
                onShareButtonClicked = {
                    val content = formViewModel.answersJson.toByteArray()
                    val filename = context.getString(R.string.isa_json, LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM-dd-yyyy_HH:mm:ss")))

                    val directory = File(context.filesDir, "shared_files")
                    if (!directory.exists()) { directory.mkdirs() }
                    val sendFile = File(directory, filename)
                    sendFile.parentFile?.mkdirs()
                    FileOutputStream(sendFile).use {
                        it.write(content)
                    }
                    val uri = FileProvider.getUriForFile(context, "com.example.isaproject.provider", sendFile)

                    val contentResolver = context.contentResolver
                    val outputStream = contentResolver.openOutputStream(uri)
                    try {
                        outputStream?.write(content)
                        outputStream?.close()
                    } catch (e: IOException) {
                        e.printStackTrace()
                    } finally {
                        outputStream?.close()
                    }

                    val sendIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "application/json"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    try {
                        context.startActivity(Intent.createChooser(sendIntent, "Share JSON File"))
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            )
        }
    }
}