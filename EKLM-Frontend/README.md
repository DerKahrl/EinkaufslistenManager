# EKLM-Frontend

## Features

### Eigenschaften
* Neue eigenschaft erstellen
* Eigenschaft löschen
* Eigenschaft löschen welche von Produkt benutzt wird
* Anzeigepriorität bearbeiten
* Anzeige vergleichsgruppen erstellen
* Eigenschaften in Gruppen einordnen

### Produkte
* Neues Produkt hinzufügen
* Produkt bearbeiten
* Produkt löschen
* Produkt löschen welches von Gericht und Einkaufsliste benutzt wird

### Einkaufslisten
* Neue Liste erstellen
* Eintrag
   * hinzufügen
      * auch mit Produkt welches es noch nicht gibt
   * bearbeiten
   * löschen
* Liste
   * teilen

       * Nutzer einsehen
       * Nutzer hinzufügen
       * Nutzer entfernen
   * Liste Löschen

* Geteilete Listen andere Nutzer einsehen
   * Dort auch einträge hinzufügen / bearbeiten und Löschen

* Liste sortieren

### Gerichte
* Neues Gericht hinzufügen
* Gericht bearbeiten
* Gericht löschen
* Gericht anklicken
  * Zutaten in einkaufsliste hinzufügen

### Benutzer
* Erstellen
* Bearbeiten
* Einloggen
* Ausloggen
* Löschen

### Einstellungen
* Darkmode


# Installation

## Virtuelle Maschine
In diesem Beispiel wird Ubuntu22.04.1 LTS benutzt:    
https://releases.ubuntu.com/22.04.1/ubuntu-22.04.1-desktop-amd64.iso

## Docker
Docker wird benötigt, um die Container auszuführen.   
Hier ist die offizielle Installationsanleitung für Ubuntu:   
https://docs.docker.com/engine/install/ubuntu/


Also die folgenden Befehle ausführen um Docker über die Paketverwaltung [APT (Advanced Packaging Tool)](https://de.wikipedia.org/wiki/Advanced_Packaging_Tool) zu installeren:

1. Das lokale Ubuntu-System auf den neusten Stand bringen:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Folgendem Befehl benötigte tools installieren:
```bash
sudo apt-get install ca-certificates curl gnupg lsb-release -y
```

3. Den PGP-Key des offiziellen Docker APT-Repositoryies hinzufügen.
```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

4. Das Docker APT-Repository installieren, dazu diesen langen Befehl ausführen:
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

5. Jetzt APT die repository liste aktualisieren lassen:

```bash
sudo apt-get update
```

6. Nun Docker installieren:
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```

## Docker container

Jetzt wo Docker installiert ist können die Container gestartet werden.    

Wichtig ist, dass `git` installiert ist:
```bash
sudo apt-get install git -y
```
    
1. Die Container herunterladen. Dies kann mit dem folgenden Befehl gemacht werden:
```bash
git clone https://......
```

2. In das erstelle Verzeichniss welchseln
```bash
cd EKLM-Projekt/
```

3. Mit Docker Compose die Container bauen und starten:
```bash
sudo docker compose up -d --build
```
* mit dem `-d` werden diese im Hintergrund gestartet. Einfach weg lassen und die ausgabe von allen drei Containern wird angezeigt.

4. Den zustand der Container anzeigen:
```bash
sudo docker ps
```

* Logs eines Containers einsehen:
```bash
sudo docker logs <container-id>
```

5. Zum herunterfahren der Container den Befehl
```bash
sudo docker compose down
```