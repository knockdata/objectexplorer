# Disk images and packages

A virtual machine's disk as `vhd` `vhdx` `avhdx` `vmdk` `qcow2` `qcow` `vdi`, a raw `img`, a disc
as `iso`, a Mac `dmg`; installers and packages as `deb` `udeb` `rpm` `pkg` `xar` `xip` `msi`

<img src="/screenshot/format-disks.png" alt="A QEMU disk image browsed as a folder: its two partitions, an NTFS volume and an ext4 volume, each a folder">

A disk image opens as the files on it, browsed as folders like an [archive](/explore/archives): its
partitions, the folders on each, and every file opening with its own viewer. Nothing is mounted and
nothing is extracted to disk: the image's blocks are read where they lie, and a file's bytes when
you open it.

## Disk images

| Kind                   | Files                 | Read                                                      |
|------------------------|-----------------------|-----------------------------------------------------------|
| Hyper-V and Virtual PC | `vhd`, `vhdx` `avhdx` | fixed and dynamic disks                                   |
| VMware                 | `vmdk`                | sparse disks, stream-optimized ones too                   |
| QEMU                   | `qcow2`               | compressed clusters too (deflate or Zstandard)            |
| VirtualBox             | `vdi`                 |                                                           |
| a raw copy             | `img`, a `dd` copy    | a partition table, or a file system from the first byte   |
| a disc                 | `iso`                 | ISO 9660 with Joliet names, and UDF when the disc has it  |
| a Mac disk image       | `dmg`                 | compressed or not (zlib, bzip2, LZFSE, LZMA, Apple's ADC) |

The partition table is read — GPT, the one disks use today, or the older MBR (master boot record)
with its extended partitions — and each partition is a folder of its own, numbered and named by its
name or its label: `1 EFI System Partition`. A disk with one volume opens straight on its files.

| File system      | Notes                                                      |
|------------------|------------------------------------------------------------|
| FAT12, 16 and 32 | USB sticks and memory cards; long names included           |
| exFAT            |                                                            |
| NTFS             | Windows'; compressed files read, its system files left out |
| ext2, ext3, ext4 | Linux's                                                    |
| APFS             | the Mac's file system, on a disk image or in a `dmg`       |
| HFS+             | in a `dmg`                                                 |
| UDF              | versions 1.02 to 2.60                                      |

A partition whose file system is not read shows as one file, `<number name>.img`, which you can
open in [hex](/explore/hex). A Linux swap area opens as the facts of its header: its version, page
size, pages, label and identifier.

### What is not read

- An encrypted volume — BitLocker, FileVault, an encrypted APFS — is named for what it is, and its
  files are not read.
- An encrypted QCOW2, a QCOW2 that rests on a backing file, and QCOW version 1; a VMDK whose
  description points at other extent files.
- An NTFS file encrypted with EFS (Windows' encrypting file system) is listed, its bytes not read;
  so is an APFS file the system compressed.

## Packages

| Package                               | Files             | What you see                                                      |
|---------------------------------------|-------------------|-------------------------------------------------------------------|
| **Debian**                            | `deb` `udeb`      | the files it installs, and its control files under `DEBIAN/`      |
| **RPM**                               | `rpm`             | the files it installs; **structure** shows its header and payload |
| **macOS installer**                   | `pkg` `xar` `xip` | its parts, and each payload as the folder of files it installs    |
| **Windows Installer**                 | `msi`             | the streams it is made of                                         |
| LHA, Japan's and the Amiga's archives | `lzh` `lha`       | its files                                                         |

RPM is Red Hat's package format, used by Fedora, openSUSE and the like. A macOS `.pkg` and `.xip`
are xar archives: their payloads, whichever way they are compressed, are opened as folders.

Next: [Anki decks](/formats/anki).
