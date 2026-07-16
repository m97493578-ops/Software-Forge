<script src="theme.js"></script>
[← Back to Dashboard](index.md)

[← Back to App Directory](App.md)

App Notes

Make More Portable: You can make Chromium more portable by copying the AppNamePortable.ini from the ChromiumPortable\Other\Source directory to the ChromiumPortable directory and renaming it to ChromiumPortable.ini. Open it in your favorite text editor and change the line that reads AdditionalParameters= to AdditionalParameters=--disable-encryption --disable-machine-id and then saving it. You should do this with a new profile and change these settings within the advanced config in the app, too. This should make it portable but will result in your passwords being stored unencrypted and your Chrome settings vulnerable to modification by outside apps.

Passwords Not Saved Between PCs By Default: Chromium stores passwords in such a way that they are encrypted in a way tied to current PC. While the passwords are not kept or left behind on the PC itself, they won't be retrievable when you move to a new PC. Logging in to Google will save and restore your passwords.

Certificates Not Portable: Chromium has no certificate manager. It uses Windows' certificates manager. So, any certificates you install through the Chromium interface are stored on the current local machine and will not travel with you. Thus, you should not use any private certificates with Chromium except on your own PC.

Some Settings/Extensions Locked Per PC: Chromium locks specific settings to a given PC. Details are included in this post. This behavior is by design by the Chrome team. If you would like this changed, please file a bug with the Chrome team. A suggested workaround is to sign in to Google to restore all settings and extensions.

Run Alongside Chrome: If you rename chrome.exe within ChromiumPortable\App\Chromium (or Chromium32 if you're on 32-bit) to Chromium.exe and edit the launcher configuration ChromiumPortable.ini within ChromiumPortable\App\AppInfo\Launcher and change chrome.exe to Chromium.exe in lines 2 and 3. Note that this configuration is unsupported and could cause issues, which is why the publisher keeps the name chrome.exe.

Note that other portable browsers such as Mozilla Firefox, Portable Edition do not have any of the issues mentioned above. These issues are specific to Chrome and Chromium-based browsers due to Chrome's design and not something we can work around without fixes to the base app by the Chrome developers.
### [Download Installer Executable](https://github.com/m97493578-ops/Software-Forge/releases/download/ChromiumPortable/Chromium_Portable_Setup.paf.exe)

## ⚖️ Open Source License & Attribution Notice
This application core is distributed as free and open-source software under the terms of the **3-Clause BSD License**, alongside sub-components subject to various permissive open-source licenses. In full compliance with distribution and attribution guidelines:

* **Official Terms**: You can read the original legal copyright text and project terms directly at the [Official Chromium LICENSE](https://github.com/chromium/chromium/blob/main/LICENSE).
* **Upstream Project**: For more information regarding development architecture, components, and builds, visit the [Official Chromium Repo](https://github.com/chromium/chromium).

*This notice satisfies mandatory attribution criteria while preserving complete project transparency.*

---

### 🔒 Safety & Integrity Note

> Because **Software Forge** is an independent, open-source project, we cannot afford the high annual cost of a commercial Code Signing Certificate. As a result, Windows SmartScreen may flag these downloads as being from an "Unknown Publisher."
> 
> To guarantee that your files are safe, authentic, and have not been modified or corrupted, you can verify them manually using PowerShell:
> 
>
> Get-FileHash .\YourDownloadedFile.paf.exe -Algorithm SHA256
> 
> 
> **The app's checksum when it was compiled is:** `313aaa913c873d401275f44e1e5f4b8338cb4c768c3c64fafa1c1bda921e2f66`
> 
> If your PowerShell output matches this hash exactly, your file is 100% safe, authentic, and untampered with!
> 
> ⚠️ **Important:** If the checksums **do not match**, do not run the executable. It means the download was corrupted or modified. Please delete the file immediately and post a comment on our forums to let us know so we can investigate right away!
© 2026 Free Software Commons. Built outside corporate walls.
