import { useRef, useMemo, useState, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { playPopSound } from '../../api/audioManager';

// Configuration for the Pop-It
const ROWS = 10;
const COLS = 10;
const BUBBLE_RADIUS = 0.8;
const BUBBLE_SPACING = 2;
const WIDTH = COLS * BUBBLE_SPACING;
const HEIGHT = ROWS * BUBBLE_SPACING;

// A dummy object to reuse for matrix calculations
const dummy = new THREE.Object3D();

const PopIt = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  // State to track which bubbles are popped to prevent re-popping.
  const [poppedBubbles, setPoppedBubbles] = useState(() => Array(ROWS * COLS).fill(false));

  const bubbleGeometry = useMemo(() => new THREE.SphereGeometry(BUBBLE_RADIUS, 16, 16), []);

  // Initialize bubble positions
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * BUBBLE_SPACING - WIDTH / 2 + BUBBLE_SPACING / 2;
        const y = row * BUBBLE_SPACING - HEIGHT / 2 + BUBBLE_SPACING / 2;
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const popBubble = (instanceId: number) => {
    setPoppedBubbles((currentPoppedState) => {
      // If bubble is already popped, do nothing.
      if (currentPoppedState[instanceId]) {
        return currentPoppedState;
      }

      // This bubble is being popped for the first time.
      playPopSound();

      const mesh = meshRef.current;
      if (!mesh) return currentPoppedState;

      // To ensure consistent positioning and avoid cumulative transforms, we
      // calculate the bubble's position from scratch rather than modifying its current matrix.
      const row = Math.floor(instanceId / COLS);
      const col = instanceId % COLS;
      const x = col * BUBBLE_SPACING - WIDTH / 2 + BUBBLE_SPACING / 2;
      const y = row * BUBBLE_SPACING - HEIGHT / 2 + BUBBLE_SPACING / 2;

      // Set the bubble to its "popped" state (pushed back).
      dummy.position.set(x, y, -1);
      dummy.updateMatrix();
      mesh.setMatrixAt(instanceId, dummy.matrix);
      mesh.instanceMatrix.needsUpdate = true;

      // Return the new state array marking this bubble as popped
      const newPoppedState = [...currentPoppedState];
      newPoppedState[instanceId] = true;
      return newPoppedState;
    });
  };

  const handlePointerEvent = (e: any) => {
    e.stopPropagation();
    const { x, y } = e.point;

    // Convert intersection point to grid coordinates
    const col = Math.floor((x + WIDTH / 2) / BUBBLE_SPACING);
    const row = Math.floor((y + HEIGHT / 2) / BUBBLE_SPACING);
    
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
      return;
    }

    // Calculate the center of the bubble in the identified cell
    const bubbleX = col * BUBBLE_SPACING - WIDTH / 2 + BUBBLE_SPACING / 2;
    const bubbleY = row * BUBBLE_SPACING - HEIGHT / 2 + BUBBLE_SPACING / 2;
    
    // Check if the intersection point is within the bubble's radius on the XY plane
    const distance = Math.sqrt(Math.pow(x - bubbleX, 2) + Math.pow(y - bubbleY, 2));

    if (distance < BUBBLE_RADIUS) {
      const instanceId = row * COLS + col;
      popBubble(instanceId);
    }
  };


  return (
    <group>
      {/* Base of the Pop-It */}
      <RoundedBox args={[WIDTH, HEIGHT, 1]} position={[0,0,-0.5]} radius={0.5}>
        <meshStandardMaterial color="#A5D6A7" />
      </RoundedBox>
      
      {/* The bubbles, rendered as a single high-performance InstancedMesh */}
      <instancedMesh
        ref={meshRef}
        args={[bubbleGeometry, undefined, ROWS * COLS]}
      >
        <meshStandardMaterial color="#81C784" />
      </instancedMesh>

      {/* An invisible plane that sits on top of the bubbles to provide a large, reliable hit area. */}
      <mesh
        onPointerDown={handlePointerEvent}
        onPointerMove={(e) => {
            // Allows for satisfying swipe-to-pop gesture
            if (e.buttons > 0) { // Check if mouse button is pressed
                handlePointerEvent(e)
            }
        }}
      >
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
};

export default PopIt;