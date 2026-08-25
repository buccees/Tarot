[app]

title = Custom Art Tarot
package.name = pictarotapp
package.domain = org.example

source.dir = .
source.include_exts = py,png,kv,atlas

version = 1.0

fullscreen = 0
orientation = portrait

icon.filename = images/AppIcons/playstore.png

# IMPORTANT:
# Pin the Python used inside the Android build.
# The host GitHub runner can remain on Python 3.11.
requirements = python3,hostpython3,kivy,requests


[buildozer]

log_level = 2

android.skip_update = False

android.sdk_path =
android.ndk_path =

android.ndk = 28c
android.api = 33
android.minapi = 24
android.build_tools = 33.0.2

android.archs = arm64-v8a,armeabi-v7a

android.permissions = INTERNET,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE

android.extract_native_libs = False
android.accept_sdk_license = True

p4a.branch = 2026.05.09
