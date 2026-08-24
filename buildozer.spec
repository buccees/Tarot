[app]

# (App metadata)
title = Custom Art Tarot
package.name = pictarotapp
package.domain = org.example
version = 1.0
source.dir = .
source.include_exts = py,png,kv,atlas
fullscreen = 0
orientation = portrait
icon.filename = images/AppIcons/playstore.png

# (App requirements - pinned versions for stability)
requirements = python3,kivy==2.1.0,sdl2==2.0.0,sdl2_image==2.0.5,sdl2_mixer==2.0.4,sdl2_ttf==2.0.15,pyjnius==1.4.0,android,setuptools,six,libffi,openssl,sqlite3,hostpython3

[buildozer]

# (Buildozer settings)
log_level = 2
android.skip_update = False
android.sdk_path =
android.ndk_path =
android.ndk = 25b
android.api = 33
android.minapi = 24
android.build_tools = 33.0.2
android.archs = arm64-v8a,armeabi-v7a
android.permissions = INTERNET,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE
android.extract_native_libs = False
android.accept_sdk_license = True
p4a.branch = develop
