package com.mindlinker.mlsdkreactnativedemo

import android.Manifest
import android.os.Build
import android.os.Bundle
import android.view.KeyEvent
import androidx.core.app.ActivityCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactApplication


class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "MLSDKReactNativeDemo"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requestAppPermissions()
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (BuildConfig.DEBUG && keyCode == 4) {
            val rnh = (application as ReactApplication).reactNativeHost
            rnh.reactInstanceManager.showDevOptionsDialog()
            return false
        }
        return super.onKeyDown(keyCode, event)
    }

    private fun requestAppPermissions() {
        val permissions = arrayOf<String>(
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO
        )
        if (!PermissionUtil.hasPermissions(this, permissions)) {
            ActivityCompat.requestPermissions(this, permissions, 1)
        }
    }
}