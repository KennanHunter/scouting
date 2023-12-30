package com.example.isaproject

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

enum class AppScreens(val label: String) {
    SelectDevice("Select Device"),
    Loading("Loading"),
    Summary("Summary")
}

@Composable
fun ISAScreen(
    modifier: Modifier = Modifier,
    formViewModel: FormViewModel = viewModel(),
    navController: NavHostController = rememberNavController()
) {
    NavHost(
            navController = navController,
            startDestination = AppScreens.SelectDevice.name,
            modifier = modifier
    ) {
        composable(route = AppScreens.SelectDevice.name) {
            SelectDeviceScreen(
                formViewModel = formViewModel,
                onConnectButtonClicked = { navController.navigate(formViewModel.form[0].name) }
            )
        }
        composable(route = AppScreens.Loading.name) {

        }
        for (i in 0 until formViewModel.form.size) {
            composable(route = formViewModel.form[i].name) {
                FormScreen(
                    formViewModel = formViewModel,
                    page = formViewModel.form[i],
                    onNextButtonClicked = {
                        if (i < formViewModel.form.size - 1) {
                            navController.navigate(formViewModel.form[i + 1].name)
                        } else {
                            navController.navigate(AppScreens.Summary.name)
                        }
                    },
                    onPreviousButtonClicked = {
                        if (i > 0) {
                            navController.navigateUp()
                        } else {
                            navController.popBackStack(AppScreens.SelectDevice.name, inclusive = false)
                        }
                    }
                )
            }
        }
        composable(route = AppScreens.Summary.name) {
            SummaryScreen(
                formViewModel = formViewModel,
                onPreviousButtonClicked = { navController.navigateUp() },
                onSubmitButtonClicked = {
                    for (i in formViewModel.form) {
                        for (j in i.page) {
                            if (j.name != "") {
                                formViewModel.setAnswer(
                                    name = j.name,
                                    value = j.value.toIntOrNull() ?: j.value.toBooleanStrictOrNull() ?: j.value
                                )
                            }
                        }
                    }
                }
            )
        }
    }
}