# The Tools panel

**Tools**, the wrench in the activity bar, opens a side panel of everyday facts about the machine
the app runs on, and one switch: keeping it awake. In a browser page of a server, the facts are the
server's. The instant page at objectexplorer.com/app has no Tools.

## Keep awake

**Keep awake** stops the computer from going to sleep while it is ticked, for a long copy, a
download or a run you leave going. The display may still turn off, and closing a laptop's lid still
puts it to sleep. Unticked, the computer sleeps as it is set to.

After you tick it, the app asks the system whether it took, and the line under it says so, or says
why not. Under that is the command that shows what the system itself says, with a copy button, to
run in a terminal:

- macOS: `pmset -g assertions | grep "Keep awake"`
- Linux: `systemd-inhibit --list | grep ObjectExplorer`
- Windows: `powercfg /requests`

## What the panel shows

| Section       | What it says                                                                                                   |
|---------------|----------------------------------------------------------------------------------------------------------------|
| **Network**   | the public address the internet sees, and every local address, each with a copy button                         |
| **Processor** | its name, how many cores and of which kinds, how busy it is in all, and a bar for each core                    |
| **Memory**    | how much is free of how much                                                                                   |
| **Disk**      | how full each disk is                                                                                          |
| **Computer**  | its model, the year it came out (a guess from its firmware's date where the model does not say), and its maker |

The numbers are read again every two seconds while the panel is open. The public address is asked
of objectexplorer.com once each time the panel opens, and it answers with the address it sees;
nothing else is sent.

Next: [where your data lives](/reference/data-locations).
