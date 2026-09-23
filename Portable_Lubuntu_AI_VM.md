# Portable Lubuntu AI VM — Project Summary

## Purpose

This project documents the creation of a **portable Lubuntu virtual machine** that can be stored on removable storage and later used from a Windows computer without installing Linux directly onto the host computer.

The longer-term goal is to use this portable Linux environment as a foundation for a **custom, portable AI workstation**.

## Environment

- Host computer: Windows library computer
- Administrative access: Not available
- Physical removable storage: 28 GB USB flash drive
- USB filesystem: NTFS
- Linux distribution: Lubuntu 26.04.1 Desktop AMD64
- Installer image:
  `lubuntu-26.04.1-desktop-amd64.iso`
- Virtualization software: QEMU for Windows
- QEMU executable:
  `qemu-system-x86_64.exe`
- Virtual disk:
  `LubuntuVM.img`
- Virtual disk format: raw
- Virtual disk size: 12 GiB
- QEMU memory allocation used: 3 GiB
- QEMU virtual CPUs used: 2
- Acceleration: TCG/software emulation

## Why QEMU Was Used

The host computer does not permit booting a different operating system from USB and does not provide administrative access for installing virtualization software.

QEMU can instead be run directly from removable storage. This makes it possible to keep the emulator, its required DLLs, the Lubuntu installer ISO, and the virtual hard disk together on removable media.

This is a **portable virtual machine**, not a bootable USB Linux installation.

## Files Built on the USB

The working USB layout contains:

```
E:\
├── QEMU\
│   ├── qemu-system-x86_64.exe
│   └── required QEMU DLLs
├── lubuntu-26.04.1-desktop-amd64.iso
└── LubuntuVM.img
```

The virtual disk was created with:

```
qemu-img.exe create -f raw "E:\LubuntuVM.img" 12G
```

The resulting file was verified in Windows as:

```
12,884,901,888 bytes
```

This confirms that the 12 GiB virtual disk image exists on the USB.

## Known-Good QEMU Launch Command

The command that successfully reached the Lubuntu graphical **Try or Install** screen was:

```
qemu-system-x86_64.exe -accel tcg -m 3G -smp 2 -vga std -display sdl -drive file="E:\LubuntuVM.img",format=raw -cdrom "E:\lubuntu-26.04.1-desktop-amd64.iso" -boot order=d
```

Keep this command as the baseline configuration.

A GTK warning about being unable to load a pixbuf from the icon theme appeared during launch. It did not prevent QEMU from starting.

## Installation Progress

The Lubuntu graphical environment was successfully reached.

The **Install Lubuntu** button was opened and the installation was started using the 12 GiB virtual disk.

The installation reached at least 15% before the session continued to be monitored. The graphical screen briefly went black during installation, but the installation percentage continued advancing, indicating that the installer was still making progress.

The USB and virtual disk should not be disconnected or deleted while installation is running.

## Important Recovery / Verification Principle

If the library session ends before installation finishes, **do not automatically delete `LubuntuVM.img` and start over**.

The Lubuntu installer does not generally provide a normal resume-from-partial-installation function. However, the existing virtual disk can be examined before deciding to reinstall.

The desired recovery workflow is:

1. Preserve the existing `LubuntuVM.img`.
2. Inspect the image and determine whether partitions/filesystems were created.
3. Check whether recognizable Linux installation files and boot information exist.
4. Attempt to boot the existing image if it appears sufficiently complete.
5. Reinstall only if inspection shows that the existing installation cannot be used.

This avoids blindly discarding partially completed work.

## Portable SSD Plan

The entire environment can be copied to a larger portable SSD after QEMU is shut down.

At minimum, preserve:

- The entire `QEMU\` directory
- `lubuntu-26.04.1-desktop-amd64.iso`
- `LubuntuVM.img`

The ISO is the installer media. The `LubuntuVM.img` file is the virtual computer's hard drive and is therefore the most important file to preserve after installation.

Do not copy the virtual disk while it is actively being modified by QEMU. Shut down the VM first so the image is in a consistent state.

## Long-Term Custom AI Potential

Once Lubuntu is successfully installed and preserved, the VM can become the base environment for a portable AI workstation.

Potential components include:

- Python
- Git
- PyTorch
- Transformers
- llama.cpp
- Local language models
- Local AI chat interfaces
- Retrieval-augmented generation (RAG)
- Document and knowledge databases
- Custom AI scripts and agents
- Project repositories
- Conversation and configuration data

A possible internal structure is:

```
/home/user/AI/
├── models/
├── projects/
├── knowledge/
├── conversations/
└── scripts/
```

The major advantage is that the Linux operating system, software configuration, AI applications, and project environment can all live inside the virtual disk. The resulting VM can then be moved between compatible Windows hosts by copying the VM files.

## Performance Considerations

The current QEMU configuration is intentionally modest:

```
3 GiB RAM
2 virtual CPUs
TCG software emulation
```

This is suitable for establishing the environment and experimenting with lightweight software, but it is not an ideal configuration for large local AI models.

On a more capable host, QEMU can potentially be given additional memory and CPU resources without rebuilding the virtual machine.

The portable architecture therefore separates the **AI environment** from the **host computer's hardware capacity**.

## Current Status

### Completed

- QEMU Windows files obtained
- Required QEMU DLLs present
- Lubuntu 26.04.1 ISO present
- 12 GiB virtual disk created
- Virtual disk verified as an actual 12,884,901,888-byte file
- QEMU successfully launched without administrator installation
- Lubuntu graphical boot environment reached
- Lubuntu installer launched
- Full installation started

### In Progress

- Completing the Lubuntu installation into `E:\LubuntuVM.img`
- Verifying the resulting installed virtual disk
- Booting the installed system without the installer ISO

### Next Milestone

After installation completes:

1. Shut down Lubuntu cleanly.
2. Keep the completed `LubuntuVM.img`.
3. Launch QEMU without the Lubuntu ISO attached.
4. Verify that the VM boots from the virtual hard disk.
5. Copy the complete portable environment to the larger SSD.
6. Begin configuring Lubuntu as the foundation for the custom AI environment.

## Key Concept

The finished product is best understood as:

```
Portable SSD
    │
    ├── QEMU
    │
    ├── Lubuntu installer ISO
    │
    └── LubuntuVM.img
             │
             └── Lubuntu + custom AI environment
```

The physical SSD is the portable container; `LubuntuVM.img` is the virtual computer's hard drive; QEMU supplies the virtual hardware; and Lubuntu supplies the Linux operating system.
