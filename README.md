# ASMR Pop-It: A Web-Based Sensory Experience

This project is a web-based, interactive ASMR Pop-It toy built with React, TypeScript, and Vite, leveraging the power of `@react-three/fiber` for 3D rendering and the Web Audio API for procedurally generated sound. It is designed as a Progressive Web App (PWA) for a seamless, installable, and offline-first experience.

## Core Tenet: Programmatic Generation

A key constraint and feature of this project is that **all graphical and audio assets are generated programmatically at runtime**. No external `.png`, `.svg`, `.glb`, or `.mp3` files are loaded for the core application experience.

-   **Graphics:** 3D models are created using Three.js geometry, rendered into the scene with `@react-three/fiber`. UI elements like icons are rendered as inline SVGs within React components.
-   **Audio:** All sound effects, from the satisfying "pop" to reward chimes, are synthesized on the fly using the Web Audio API.

## Features

-   **Interactive 3D Pop-It:** A realistic, interactive Pop-It toy that can be rotated and manipulated.
-   **Procedural Audio:** Satisfying pop sounds with slight variations, providing a rich ASMR experience.
-   **Multiple Game Modes:**
    -   **Free Play:** Simply pop for relaxation.
    -   **Pop Race:** Race against the clock to pop all the bubbles.
    -   **Memory Pop:** Test your memory by repeating increasingly long sequences.
    -   **Learning Modes:** Alphabet and number popping for educational fun.
-   **PWA Ready:** Install the app on your device for easy access and offline play.

## Tech Stack

-   **Framework:** React 19 + Vite
-   **Language:** TypeScript
-   **3D Rendering:** `@react-three/fiber`, `@react-three/drei`, `three.js`
-   **Animation:** `@react-spring/three`
-   **State Management:** Zustand
-   **Audio:** Web Audio API
-   **Deployment:** PWA, deployable to services like GitHub Pages.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```

This will start the Vite development server, and you can open your browser to interact with the application.
