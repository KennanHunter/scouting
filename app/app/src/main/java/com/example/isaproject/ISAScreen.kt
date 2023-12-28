package com.example.isaproject

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun ISAScreen(
    formViewModel: FormViewModel = viewModel(),
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {},
        bottomBar = {},
        floatingActionButton = {}
    ) { innerPadding ->
        FormScreen(
            formViewModel = formViewModel,
            modifier = modifier.padding(innerPadding)
        )
    }
}