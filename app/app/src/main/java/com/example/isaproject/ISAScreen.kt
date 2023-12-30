package com.example.isaproject

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController

enum class FormScreens() {
    SelectDevice,
    
}

@Composable
fun ISAScreen(
    formViewModel: FormViewModel = viewModel(),
    navController: NavHostController = rememberNavController(),
    modifier: Modifier = Modifier
) {
    Scaffold(
        bottomBar = {}
    ) { innerPadding ->
        FormScreen(formViewModel = formViewModel, modifier = Modifier.padding(innerPadding))
//        NavHost(
//            navController = navController,
//            modifier = modifier.padding(innerPadding)
//        ) {
//
//        }
    }
}