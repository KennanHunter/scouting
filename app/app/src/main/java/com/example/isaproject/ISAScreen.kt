package com.example.isaproject

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun ISAScreen(
    modifier: Modifier = Modifier,
    formViewModel: FormViewModel = viewModel(),
    navController: NavHostController = rememberNavController()
) {
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
                onNextButtonClicked = { navController.navigate(formViewModel.form[0].name) }
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
                            if (formViewModel.answers["noshow"].toString().toBooleanStrictOrNull() == true) {
                                formViewModel.cleanAnswers()
                                navController.navigate(AppScreen.Summary.name)
                            } else {
                                navController.navigate(formViewModel.form[i + 1].name)
                            }
                        }
                    },
                    onPreviousButtonClicked = {
                        if (i == 0) {
                            navController.popBackStack(AppScreen.SetupDevice.name, inclusive = false)
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
                onPreviousButtonClicked = { navController.navigateUp() },
                onSubmitButtonClicked = {
                    formViewModel.initAnswers()
                    navController.popBackStack(AppScreen.MatchInfo.name, inclusive = false)
                }
            )
        }
    }
}