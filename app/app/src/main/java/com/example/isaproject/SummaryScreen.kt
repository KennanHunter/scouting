package com.example.isaproject

import android.app.Activity
import android.content.Intent
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

const val CREATE_FILE = 1

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun SummaryScreen(
    formViewModel: FormViewModel,
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
                onNextButtonClicked = {
                    //TODO: send data 
                    onSubmitButtonClicked()
                },
                previousButtonLabel = stringResource(R.string.previous),
                onPreviousButtonClicked = onPreviousButtonClicked
            )
        },
        modifier = modifier
    ) { innerPadding ->
        val context = LocalContext.current
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .padding(all = dimensionResource(R.dimen.margin))
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = formViewModel.answersJson,
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.fillMaxWidth()
            )
            FormSpace(modifier = Modifier.height(dimensionResource(R.dimen.margin)))
            Button(
                onClick = {
                    val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "application/json"
                        putExtra(Intent.EXTRA_TITLE, context.getString(R.string.isa_json, LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM-dd-yyyy HH:mm:ss"))))
                    }
                    val activity = context as? Activity
                    activity?.startActivityForResult(intent, CREATE_FILE)
                }
            ) {
                Text(stringResource(R.string.download_json))
            }
        }
    }
}