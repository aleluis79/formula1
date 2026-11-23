# F1 Arcade Racing

Juego de carreras arcade de Fórmula 1 hecho con **HTML, CSS y JavaScript**, usando **Three.js** para el renderizado 3D. No requiere instalación ni proceso de build: se ejecuta directamente en el navegador.

## Características

### Modos de juego
- **Campeonato**: 5 carreras con puntuación (top 10), clasificación general y campeón final.
- **Carrera rápida**: una sola carrera eligiendo circuito, clima y color del auto.

### Circuitos
1. Circuito Nacional
2. Circuito del Valle
3. Circuito Serpiente
4. Circuito de Montaña (con montañas nevadas alrededor)
5. Circuito de Las Vegas (trazado basado en el circuito real del GP de Las Vegas)

### Clima
- **Seco**: condiciones normales.
- **Lluvia**: partículas de lluvia, sonido ambiental, asfalto mojado, banda verde en los neumáticos y menos agarre/frenada para el jugador y la IA.
- **Noche**: cielo oscuro con estrellas y luna, iluminación atenuada y torres de luz con charcos de luz sobre la pista.
- En **Campeonato** el clima es aleatorio en cada carrera (con al menos una carrera no seca).
- En **Carrera rápida** se elige manualmente (Seco / Lluvia / Noche).

### Autos
- Modelos low-poly de F1 con casco y visera del piloto, halo, espejos, suspensiones, sidepods, difusor, alerones con endplates y neumáticos con banda de compuesto.
- Ruedas delanteras direccionales: giran con la dirección y ruedan según la velocidad (también en los rivales).
- Humo en los neumáticos al frenar bruscamente o derrapar.
- Alerones y casco con **color de contraste** respecto a la carrocería.
- Color del auto seleccionable desde el menú.
- Caja de **8 marchas** con cambios progresivos, corte de encendido, sonido de cambio y luces de cambio (shift lights).
- Velocidad punta de **350 km/h** mostrada en el HUD, ampliable hasta ~392 km/h con nitro.

### Sonido
- Motor sintetizado con Web Audio (varias capas, turbo, admisión y limitador).
- Sonido de derrape, lluvia, cambios de marcha, cuenta regresiva y meta.

### HUD y ayudas
- Posición, vueltas, cronómetro, velocímetro, marcha, nitro, minimapa y espejo retrovisor.
- Indicador **−1 VUELTA** cuando el jugador queda doblado: pasar autos no da posiciones hasta recuperar la vuelta.
- Aviso de **sentido contrario** con cuenta regresiva de 3 segundos y reubicación automática en la pista si no se corrige.
- Pausa, silencio y notificaciones del mando.
- Tras cruzar la meta, el coche hace una vuelta de enfriamiento siguiendo la pista y se detiene dentro del asfalto.

## Requisitos
- Navegador moderno con **WebGL** (Chrome, Firefox, Edge, Safari).
- Conexión a internet para cargar **Three.js r128** desde CDN (cdnjs).
- Audio del navegador habilitado para escuchar el motor y la lluvia.

## Cómo ejecutarlo

### Opción 1: abrir directamente
Abrir `index.html` en el navegador.

### Opción 2: servidor local (recomendado)
Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000
```

## Controles

| Acción | Teclado | Mando |
| --- | --- | --- |
| Acelerar | ↑ / W | RT |
| Frenar | ↓ / S | LT |
| Girar | ← → / A D | Stick izquierdo |
| Freno de mano | Espacio | X / LB |
| Nitro | Z | RB / Y |
| Pausa | P | START |
| Silenciar | M | — |

## Estructura del proyecto

```text
.
├── index.html   # Estructura del menú, HUD y pantallas
├── style.css    # Estilos del menú, HUD y resultados
├── game.js      # Lógica del juego, escena, física, audio y UI
└── README.md
```

## Notas técnicas
- Todo el juego vive en `game.js`; no hay bundler ni dependencias locales.
- Three.js se carga desde CDN en `index.html`.
- Los circuitos se generan a partir de listas de puntos y una curva `CatmullRomCurve3`.
- El auto, las gradas, las montañas y los efectos se crean proceduralmente.
- La pista de Las Vegas usa un render plano texturizado para mantener continuos los bordillos en sus curvas más cerradas.
- El audio se sintetiza en tiempo real con Web Audio API.

## Créditos
- Motor 3D: [Three.js](https://threejs.org/) (r128).
- Geometría de referencia del trazado de Las Vegas: repositorio [bacinger/f1-circuits](https://github.com/bacinger/f1-circuits).
- Proyecto no oficial, sin relación con Formula 1, la FIA ni los equipos. Solo con fines educativos y de entretenimiento.
