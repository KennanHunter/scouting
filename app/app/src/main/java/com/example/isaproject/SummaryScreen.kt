package com.example.isaproject

import android.content.Intent
import android.os.Build
import android.util.Log
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
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

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
                    val content = formViewModel.answersJson
                    val filename = context.getString(R.string.isa_json, LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM-dd-yyyy HH:mm:ss")))

                    val directory = File(context.filesDir, "shared_files")
                    if (!directory.exists()) directory.mkdirs()
                    val file = File(directory, filename)
                    Log.d("FileSharing", "File path: ${file.absolutePath}")
                    file.parentFile?.mkdirs()
                    FileOutputStream(file).use {
                        it.write(content.toByteArray())
                    }
                    val fileUri = FileProvider.getUriForFile(context, "com.example.isaproject.provider", file)
                    Log.d("FileSharing", "File URI: $fileUri")


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
            ) {
                Text(stringResource(R.string.download_json))
            }
        }
    }
}