package com.example.isaproject

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.repeatOnLifecycle
import kotlinx.coroutines.flow.Flow

@Composable
fun <T : Any> SingleEventEffect(
    sideEffectFlow: Flow<T>,
    lifeCycleState: Lifecycle.State = Lifecycle.State.STARTED,
    collector: (T) -> Unit
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(sideEffectFlow) {
        lifecycleOwner.repeatOnLifecycle(lifeCycleState) {
            sideEffectFlow.collect(collector)
        }
    }
}

fun <T> Iterable<T>.flattenNested(): ArrayList<T> {
    var result = ArrayList<T>()
    for (element in this) {
        if (element is Iterable<*>) {
            element.flattenNested().forEach {
                @Suppress("UNCHECKED_CAST")
                result.add(it as T)
            }
        } else {
            result.add(element)
        }
    }
    return result
}

// From Baeldung
inline fun <reified T : Enum<T>> enumByNameIgnoreCase(input: String, default: T? = null): T? {
    return enumValues<T>().firstOrNull { it.name.equals(input, true) } ?: default
}
