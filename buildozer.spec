[app]

title = Custom Art Tarot
package.name = pictarotapp
package.domain = com.buccees

source.dir = .
source.include_exts = py,png,jpg,jpeg,atlas,kv,json,txt

version = 1.0

fullscreen = 0
orientation = portrait

icon.filename = images/AppIcons/playstore.png

requirements = python3,kivy

# Android configuration
android.skip_update = True

android.sdk_path = /home/runner/android-sdk
android.ndk_path = /home/runner/android-sdk/ndk/28.2.13676358

android.api = 36
android.ndk = 28c
android.minapi = 24

android.archs = arm64-v8a

android.permissions = INTERNET

android.extract_native_libs = False
android.accept_sdk_license = True


[buildozer]

log_level = 2
