package com.example.isaproject

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun ISAScreen(
    formViewModel: FormViewModel = viewModel(),
    navController: NavHostController = rememberNavController(),
    modifier: Modifier = Modifier
) {
    Scaffold(
//        bottomBar = {
//            BottomAppBar(
//                actions = {
//                    OutlinedButton(
//                        onClick = { /*TODO*/ },
//                        modifier = Modifier
//                            .padding(horizontal = dimensionResource(R.dimen.margin))
//                            .weight(1f)
//                    ) {
//                        Text(stringResource(R.string.previous))
//                    }
//                    Button(
//                        onClick = { /*TODO*/ },
//                        modifier = Modifier
//                            .padding(horizontal = dimensionResource(R.dimen.margin))
//                            .weight(1f)
//                    ) {
//                        Text(stringResource(R.string.next))
//                    }
//                }
//            )
//        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "FormPage1",
            modifier = modifier.padding(innerPadding)
        ) {
            composable(route = "SelectDevice") {

            }
            composable(route = "Loading") {

            }
            for (i in formViewModel.form) {
                composable(route = i.name) {
                    FormScreen(
                        formViewModel = formViewModel,
                        page = i
                    )
                }
            }
        }
    }
}