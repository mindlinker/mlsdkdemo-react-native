package com.mindlinker.mlsdkreactnativedemo

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat

/**
 * 添加描述
 *
 * @author wujiabao
 * @date 2020-12-25 17:26.
 */
object PermissionUtil {
    private const val TAG = "PermissionUtil"
    val REQUEST_AUDIO = 10001
    val REQUEST_CAMERA = 10002

    val ACTION_USB_PERMISSION = "com.serenegiant.USB_PERMISSION.MaxME"

    fun isIntentAvaliable(context: Context, intent: Intent): Boolean {
        val list = context.packageManager.queryIntentActivities(intent, PackageManager.MATCH_ALL)
        return list.size > 0
    }

    fun hasPermission(context: Context, permission: String): Boolean {
        if (ActivityCompat.checkSelfPermission(
                context,
                permission
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return false
        }
        return true
    }

    fun hasPermissions(context: Context, permissions: Array<String>): Boolean {
        for (permission in permissions) {
            if (ActivityCompat.checkSelfPermission(
                    context,
                    permission
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                return false
            }
        }
        return true
    }

    fun openPermissionSettingActivity(context: Context) {
        val intent = Intent()
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        if (Build.VERSION.SDK_INT >= 9) {
            intent.action = "android.settings.APPLICATION_DETAILS_SETTINGS"
            intent.data = Uri.fromParts("package", context.packageName, null)
        } else {
            intent.action = Intent.ACTION_VIEW
            intent.setClassName("com.android.settings", "com.android.settings.InstalledAppDetails")
            intent.putExtra("com.android.settings.ApplicationPkgName", context.packageName)
        }
    }

    fun canDrawOberlays(context: Context): Boolean {
        // TODO Android O 存在开启悬浮窗权限后，canDrawOverlays返回false问题，使用下面方式判断
        return Settings.canDrawOverlays(context)
    }

    // 检查悬浮窗权限
    fun checkFloatWindowPermission(activity: Activity?) {
        if (Build.VERSION.SDK_INT < 23) {
            return
        }
        activity?.let {
            val result = canDrawOberlays(activity)
            if (!result) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + activity.packageName)
                )
            }
        }
    }

    // 开启共享屏幕
    private const val TYPE_SCREEN_CAPTURE = 0
    private const val EXTRA_MEDIA_PROJECTION =
        "android.media.projection.extra.EXTRA_MEDIA_PROJECTION"
}
