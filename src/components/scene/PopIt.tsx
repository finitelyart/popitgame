import { RoundedBox } from '@react-three/drei'

const PopIt = () => {
  // This is a placeholder component. The final version will use
  // InstancedMesh for bubbles and handle interaction logic.
  return (
    <group>
      <RoundedBox args={[20, 20, 1]}>
        <meshStandardMaterial color="#A5D6A7" />
      </RoundedBox>
      {/* InstancedMesh for bubbles will go here later */}
    </group>
  );
};

export default PopIt;