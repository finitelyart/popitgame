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
  
  const [poppedBubbles, setPoppedBubbles] = useState(() => Array(ROWS * COLS).fill(false));

  const [bubbleGeometry, bubbleMaterial] = useMemo(() => {
    const geometry = new THREE.SphereGeometry(BUBBLE_RADIUS, 16, 16);
    const count = ROWS * COLS;
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // A simple rainbow gradient across all bubbles
      color.setHSL(i / count, 0.7, 0.6).toArray(colors, i * 3);
    }
    geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
    
    const material = new THREE.MeshStandardMaterial({ vertexColors: true });
    
    return [geometry, material];
  }, []);

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
  }, [bubbleGeometry]);

  const setBubbleState = (instanceId: number, shouldBePopped: boolean) => {
    setPoppedBubbles((currentPoppedState) => {
      // If the bubble is already in the desired state, do nothing.
      if (currentPoppedState[instanceId] === shouldBePopped) {
        return currentPoppedState;
      }
  
      playPopSound();
  
      const mesh = meshRef.current;
      if (!mesh) return currentPoppedState;
  
      const row = Math.floor(instanceId / COLS);
      const col = instanceId % COLS;
      const x = col * BUBBLE_SPACING - WIDTH / 2 + BUBBLE_SPACING / 2;
      const y = row * BUBBLE_SPACING - HEIGHT / 2 + BUBBLE_SPACING / 2;
  
      // Set the bubble to its new state (popped: z=-1, un-popped: z=0).
      dummy.position.set(x, y, shouldBePopped ? -1 : 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(instanceId, dummy.matrix);
      mesh.instanceMatrix.needsUpdate = true;
  
      const newPoppedState = [...currentPoppedState];
      newPoppedState[instanceId] = shouldBePopped;
      return newPoppedState;
    });
  };

  const handlePointerEvent = (e: any, action: 'pop' | 'unpop') => {
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
      setBubbleState(instanceId, action === 'pop');
    }
  };


  return (
    <group>
      {/* Base of the Pop-It */}
      <RoundedBox args={[WIDTH, HEIGHT, 1]} position={[0,0,-0.5]} radius={0.5}>
        <meshStandardMaterial color="#ECEFF1" />
      </RoundedBox>
      
      {/* The bubbles, rendered with instance-specific colors */}
      <instancedMesh
        ref={meshRef}
        args={[bubbleGeometry, bubbleMaterial, ROWS * COLS]}
      />

      {/* FRONT invisible plane for popping bubbles (pushing them in) */}
      <mesh
        onPointerDown={(e) => handlePointerEvent(e, 'pop')}
        onPointerMove={(e) => {
            if (e.buttons > 0) handlePointerEvent(e, 'pop')
        }}
      >
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* BACK invisible plane for un-popping bubbles (pushing them out) */}
      <mesh
        position={[0, 0, -1]}
        onPointerDown={(e) => handlePointerEvent(e, 'unpop')}
        onPointerMove={(e) => {
            if (e.buttons > 0) handlePointerEvent(e, 'unpop')
        }}
      >
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
};

export default PopIt;