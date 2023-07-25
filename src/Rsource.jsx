//
import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
//
export default function Rsource({ circuit, source, sourcetexs }) {
  //
  console.log('Rsource. ')
  //
  const aMeshRef = useRef()
  //
  const aN0 = source.links[0]
  const aN1 = source.links[1]
  //
  const aN0X = aN0.obj.x
  const aN0Y = aN0.obj.y
  //
  const aN1X = aN1.obj.x
  const aN1Y = aN1.obj.y
  //
  const aX = (aN0X + aN1X) / 2
  const aY = (aN0Y + aN1Y) / 2
  const aW = Math.abs(aN0X - aN1X)
  const aH = aW
  //
  const doClick = () => {
    try {
      const aCount = source.states.length
      if (aCount > 0) {
        let aStateNo = source.stateNo
        aStateNo = (aStateNo + 1) % aCount
        source.stateNo = aStateNo
      }
    } catch (theErr) {
      //
    }
  }
  //
  useFrame(() => {
    const aStateNo = source.stateNo
    const aMap = sourcetexs[aStateNo]
    aMeshRef.current.material.map = aMap
  })
  //
  // https://github.com/onion2k/r3f-by-example/blob/develop/examples/geometry/wirewrap/src/index.js
  //
  return (
    <mesh position={[aX, aY, 0]} ref={aMeshRef} onClick={doClick}>
      <planeGeometry args={[aW, aH]} />
      <meshBasicMaterial side={THREE.DoubleSide} map={sourcetexs[0]} />
    </mesh>
  )
}
//
