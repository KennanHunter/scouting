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
                onConnectButtonClicked = { navController.navigate(AppScreen.Loading.name) }
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
                        formViewModel.cleanAnswers()
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
                            formViewModel.cleanAnswers()
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
                    val content = formViewModel.answersJson
                    val filename = context.getString(R.string.isa_json, LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM-dd-yyyy_HH:mm:ss")))

                    val directory = File(context.filesDir, "shared_files")
                    if (!directory.exists()) { directory.mkdirs() }
                    val file = File(directory, filename)
                    file.parentFile?.mkdirs()
                    FileOutputStream(file).use {
                        it.write(content.toByteArray())
                    }
                    val fileUri = FileProvider.getUriForFile(context, "com.example.isaproject.provider", file)

                    val intent = Intent(Intent.ACTION_SEND).apply {
                        type = "application/json"
                        putExtra(Intent.EXTRA_STREAM, fileUri)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    try {
                        context.startActivity(Intent.createChooser(intent, "Share JSON File"))
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            )
        }
    }
}