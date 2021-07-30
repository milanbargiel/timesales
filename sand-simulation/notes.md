# Meeting 1 [Maurits, Max]

Soll sich so ungefähr anfühlen --> Nicht genau

Zwei farben die sich vermischen --> damit man die Struktur in der Verschiebung sieht

Keine Interaktion

## Pausieren

Play/Pause Button

Browser Fenster größer kleiner

## Farben

Bisschen heller --> Pastelliger
keine starken Kontraste
Bisschen noise

https://www.youtube.com/watch?v=lSJE-vKBnU4

# Meeting 2 [Milan, Max]

ID in der URL

Fetch gegen ne Datenbank in der der Progress steht

Regelmäßig den Progress+ID an die Datenbank schicken

# Meeting 3 [Maurits, Max]

[x] Sand soll sofort konisch nachrutschen, weniger rieseln

[x] Animation soll weiterlaufen wenn der Tab im Hintergrund befindet

Sand mehr wie sedimente aussehen lassen

Mobile soll auch sein

Auflösung nen bisschen höher

_Weiterleitung nach Ablaufen der Simulation_

# Meeting 4 [Milan, Max]

[ ] Bundle als ES6 builden - Init(duration, progress) - Pause / Unpause - getProgress()
--> fetch("api.url.com")

# Meeting 5 [Maurits, Milan]

- Wellen Linien
  - Vielleicht einfach sinus wellen horizontal
- Noch viel mehr horizontaler
- Nicht so konisch,

# Meeting 6 [Maurits, Max]

_PERFOMANCE_

- evt. Auflösung reduzieren
- Auf dem Handy bleibt es einfach hängen
- Die Größe vom canvas ist größer als der Screen, deswegen overflowed der screen manchmal

_TON_

- Ton läuft weiter, obwohl die Animation beendet ist, oder pausiert ist

_FLOW_

- Übergabe an Nuxt wenn die Animation durchgelaufen ist
- Nach der Animation soll direkt das Chatbot Fenster aufploppen

# Meeting 7 [Maurits, Ludwig, Katja, Milan, Max] 26.07

_PERFOMANCE_
- Auch auf performanten Geräten wird die Pixelgröße runterskaliert
- Teilweise bleibt nach dem Ablaufen der Animation noch etwas Sand übrig
    -> Könnte daran liegen das die Animation und der Timekeeper asynchron gestartet werden
    -> Evt. nach Ablauf der Zeit die Animation vortführen, damit die restlichen Sandkörner auch noch verschwinden
