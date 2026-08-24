[app]

title = Custom Art Tarot
package.name = pictarotapp
package.domain = org.example
version = 1.0
source.dir = .
source.include_exts = py,png,kv,atlas
fullscreen = 0
orientation = portrait
icon.filename = images/AppIcons/playstore.png

requirements = python3,kivy==2.2.0,sdl2==2.0.0,sdl2_image,sdl2_mixer,sdl2_ttf,pyjnius==1.4.0,android,setuptools,six,libffi,openssl,sqlite3,hostpython3

[buildozer]

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
p4a.branch = 2026.05.09
