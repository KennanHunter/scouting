package com.example.isaproject

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource

@Composable
fun SummaryScreen(
    onPreviousButtonClicked: () -> Unit,
    onSubmitButtonClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            PageTitle(text = AppScreens.Summary.label)
        },
        bottomBar = {
            BottomNavBar(
                canNavigateBack = true,
                nextButtonLabel = stringResource(R.string.submit),
                onNextButtonClicked = onSubmitButtonClicked,
                previousButtonLabel = stringResource(R.string.previous),
                onPreviousButtonClicked = onPreviousButtonClicked
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Text(
            text = "Congrats. You finished the form.",
            style = MaterialTheme.typography.displayLarge,
            modifier = Modifier
                .padding(innerPadding)
                .padding(all = dimensionResource(R.dimen.margin))
        )
    }
}