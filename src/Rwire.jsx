//
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
//
export default function Rwire({ circuit, wire }) {
  //
  console.log("Rwire. ")
  //
  const aN0 = wire.links[0]
  const aN1 = wire.links[1]
  //
  const aN0X = aN0.obj.x
  const aN0Y = aN0.obj.y
  const aN0N = aN0.obj.n
  //
  const aN1X = aN1.obj.x
  const aN1Y = aN1.obj.y
  const aN1N = aN1.obj.n
  //
  const aCurve = new THREE.LineCurve3(
    new THREE.Vector3(aN0X, aN0Y, 0),
    new THREE.Vector3(aN1X, aN1Y, 0)
  )
  //
  // path,segments,radiius,closed
  const aTubeGeometry = new THREE.TubeGeometry(
    aCurve,
    64, //segments in extrusion
    0.01, //radius of tube
    8, //segments around tube
    false
  )
  //
  const aAngle = (aN0N / circuit.count) * 300
  const aColor = new THREE.Color(`hsl(${aAngle}, 100%, 50%)`)
  //
  // https://github.com/onion2k/r3f-by-example/blob/develop/examples/geometry/wirewrap/src/index.js
  //
  return (
    <mesh geometry={aTubeGeometry}>
      <meshBasicMaterial color={aColor} side={THREE.DoubleSide} />
    </mesh>
  )
}
//
