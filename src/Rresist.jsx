//
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
//
export default function Rresist({ circuit, resist }) {
  //
  console.log("Rresist. ")
  //
  const aN0 = resist.links[0]
  const aN1 = resist.links[1]
  //
  const aN0X = aN0.obj.x
  const aN0Y = aN0.obj.y
  const aN0N = aN0.obj.n
  //
  const aN1X = aN1.obj.x
  const aN1Y = aN1.obj.y
  const aN1N = aN1.obj.n
  //
  const aX = (aN0X + aN1X) / 2
  const aY = (aN0Y + aN1Y) / 2
  const aW = Math.abs(aN0X - aN1X)
  const aH = aW / 3
  //
  const aAngle = (aN0N / circuit.count) * 300
  const aColor = new THREE.Color(`hsl(${aAngle}, 100%, 50%)`)
  //
  // https://github.com/onion2k/r3f-by-example/blob/develop/examples/geometry/wirewrap/src/index.js
  //
  return (
    <mesh position={[aX, aY, 0]}>
      <planeGeometry args={[aW, aH]} />
      <meshBasicMaterial color={aColor} side={THREE.DoubleSide} />
    </mesh>
  )
}
//
