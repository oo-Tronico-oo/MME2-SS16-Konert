# Eine kleine Schritt für Schritt Anleitung für euch :)

### Schritt 1: <u>Im Terminal</u> "npm install -g mocha" *// Mocha-Modul global installieren*

### Schritt 2: Umgebungsvariablen setzen und Server starten

* **Für Windows:** Ich habe eine ausführbare Batch-Datei erstellt (Ordner: windows-scripts), welche die Umgebungsvariablen setzt und den server startet. Einfach Doppelklicken zum Starten, STRG+C zum beenden.
* **Für Webstorm:** Rechts oben neben dem "Play" Button auf das Dropdown-Menü -> Edit Configurations... , dann in einer Nods.js Configuration rechts die Environment Variables setzen.
* **Alternativ:** Natürlich lässt sich auch alles von Hand via Terminal starten.

### Schritt 3: Test starten (dafür muss der Server selbstverständlich bereits laufen)

* **Für Windows:** Auch hierfür habe ich wieder ein Script erstellt(Damit'S möglichst einfach bleibt)
* **Für Webstorm:** Parallel wie oben, diesmal eine npm Config erstellen/auswählen, ggf. das package.json und als Command "test" auswählen
* **Alternativ:** Terminal..

*Damit sollte die Konfiguration an sich abgeschlossen sein..*
*(Feedback erwünscht)*