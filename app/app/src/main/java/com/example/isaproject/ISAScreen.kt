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
            startDestination = "FormPage1",
            modifier = modifier
    ) {
        composable(route = AppScreens.SelectDevice.name) {

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
                        }
                    }
                )
            }
        }
        composable(route = AppScreens.Summary.name) {
            SummaryScreen(
                onPreviousButtonClicked = { navController.navigateUp() },
                onSubmitButtonClicked = { /*TODO*/ })
        }
    }
}