import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import PopIt from './PopIt';

const Experience = () => {
  return (
    <Canvas>
      <color attach="background" args={['#90E0EF']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 0, 30]} />
      <OrbitControls 
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      
      <PopIt />

    </Canvas>
  );
};

export default Experience;