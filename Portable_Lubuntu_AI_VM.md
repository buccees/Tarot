# Portable Lubuntu AI VM — Project Summary

## Purpose
This document records the current working state of the portable Lubuntu VM experiment so the setup can be reproduced and resumed without administrative access.

## Project Goal
Build a portable Lubuntu environment that can run from removable storage through QEMU, then develop it into a portable custom AI environment.

## Current Working State
The Lubuntu installation is complete and boots successfully from the persistent virtual disk without the installer ISO.
The VM disk is E:\LubuntuVM.img.
The portable QEMU directory is E:\QEMU\.
The QEMU directory contains the matching executable and supporting DLLs required by the working setup, including libgnutls-30.dll.
The working launcher is qemu-system-x86_64.exe. The original Windows GUI executable is preserved as qemu-system-x86_64w.exe.
The working qemu-system-x86_64.exe was restored from that original matching executable. A separate standalone QEMU executable was tested during recovery but was not retained because it did not match the existing DLL set.

## Normal Startup
Open Command Prompt and run:

    E:
    cd \QEMU
    qemu-system-x86_64.exe -accel tcg -m 3G -smp 2 -vga std -global isa-fdc.fdtypeA=none -global isa-fdc.fdtypeB=none -drive file="E:\LubuntuVM.img",format=raw,if=ide -boot order=c

This is the persistent startup procedure for the current setup. Changes made inside Lubuntu are stored in LubuntuVM.img, so the VM installation persists between launches.

## Important Startup Rules
- Do not recreate or delete LubuntuVM.img.
- Do not attach the installer ISO during normal startup.
- Keep the matching QEMU executable and DLLs together in QEMU\.
- Do not replace the working QEMU executable with an unrelated standalone build unless the entire matching QEMU bundle is also replaced.
- The command assumes the removable drive is assigned E:.
- If Windows assigns the removable drive another letter, update the drive letter in the command.

## Installer Configuration
The known-good installer configuration remains available if a deliberate reinstall is ever required:

    qemu-system-x86_64.exe -accel tcg -m 3G -smp 2 -vga std -global isa-fdc.fdtypeA=none -global isa-fdc.fdtypeB=none -drive file="E:\LubuntuVM.img",format=raw,if=ide -cdrom "E:\lubuntu-26.04.1-desktop-amd64.iso" -boot order=d

This command is not for normal startup.

## Installation History
- QEMU was configured for TCG/software emulation.
- VM configuration: 3 GB RAM, 2 virtual CPUs, standard VGA.
- Floppy drives were explicitly disabled after floppy I/O errors appeared.
- A 12 GiB raw virtual disk was created as LubuntuVM.img.
- Lubuntu was installed using the full installation option.
- The installation completed successfully.
- The system was subsequently booted without the ISO.
- The Lubuntu desktop was reached successfully.
- The QEMU executable later became a 0-byte file and was removed.
- The original matching QEMU Windows executable and DLL bundle were still present in E:\QEMU\.
- The original executable was restored and the VM successfully launched again.
- The current setup remains intact and persistent.

## Portable File Layout
    E:\
    ├── QEMU\
    │   ├── qemu-system-x86_64.exe
    │   ├── qemu-system-x86_64w.exe
    │   ├── QEMU DLL files
    │   ├── lib\
    │   └── share\
    ├── LubuntuVM.img
    └── lubuntu-26.04.1-desktop-amd64.iso

## Portability Objective
The environment is intended to remain portable and usable on compatible machines without requiring administrative installation.
The removable storage can eventually be moved to a larger portable SSD. Before moving it, Lubuntu should be shut down cleanly and the complete QEMU directory and VM image should be copied.

## Next Development Phase
1. Move the environment to larger portable SSD storage.
2. Confirm the VM still boots from the new location.
3. Configure Lubuntu for development.
4. Establish the development and tooling workflow.
5. Add local AI tools and models.
6. Build the custom AI environment inside the VM.
7. Document the resulting portable workflow so it can be reproduced on other compatible machines without administrative access.

## Recovery Principle
If QEMU stops launching, troubleshoot the QEMU executable and its matching DLL bundle first.
The persistent VM disk is independent of the QEMU executable. A QEMU launcher problem does not mean the Lubuntu installation needs to be recreated.
Always protect LubuntuVM.img before attempting repairs to QEMU.