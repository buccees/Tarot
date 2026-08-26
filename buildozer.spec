[app]

title = Custom Art Tarot
package.name = pictarotapp
package.domain = com.buccees

source.dir = .
source.include_exts = py,png,jpg,jpeg,kv,atlas,json,txt

version = 1.0

fullscreen = 0
orientation = portrait

icon.filename = images/AppIcons/playstore.png

# IMPORTANT:
# Pin the Python used inside the Android build.
# The host GitHub runner can remain on Python 3.11.
requirements = python3,kivy,requests


[buildozer]

log_level = 2

android.skip_update = False

android.sdk_path =
android.ndk_path =

android.api = 35
android.ndk = 28c
android.minapi = 24

android.archs = arm64-v8a

android.permissions = INTERNET

android.extract_native_libs = False
android.accept_sdk_license = True
