//
import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { channelColor } from './utils.js'
import { logDebug } from './utils.js'
//
// https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9
// https://github.com/onion2k/r3f-by-example/blob/develop/examples/geometry/wirewrap/src/index.js
// https://docs.pmnd.rs/react-three-fiber/api/hooks
//
function getSource(circuit, n) {
  let aReturn = null
  try {
    const aSrcCount = circuit.sources.length
    for (let aSI = 0; aSI < aSrcCount; aSI++) {
      const aSrc = circuit.sources[aSI]
      if (aSrc.links[1].obj.n == n) {
        aReturn = aSrc
        break
      }
    }
  } catch (theErr) {
    logDebug(`Error: Rled.jsx: getSource. ${theErr}`)
  }
  return aReturn
}
//
export default function Rled({ circuit, led, ledcolors }) {
  //
  console.log('Rled. ')
  //
  const aCircleRef = useRef()
  //
  const aN0 = led.links[0]
  const aN1 = led.links[1]
  //
  const aN0X = aN0.obj.x
  const aN0Y = aN0.obj.y
  const aN0N = aN0.obj.n
  const aS0 = getSource(circuit, aN0N)
  //
  const aN1X = aN1.obj.x
  const aN1Y = aN1.obj.y
  const aN1N = aN1.obj.n
  const aS1 = getSource(circuit, aN1N)
  //
  const aDX = aN1X - aN0X
  const aDY = aN1Y - aN0Y
  //
  const aNCX = (aN0X + aN1X) / 2
  const aNCY = (aN0Y + aN1Y) / 2
  //
  const aDXDX = aDX * aDX
  const aDYDY = aDY * aDY
  const aSegLength = Math.sqrt(aDXDX + aDYDY)
  const aSegAngle = Math.atan2(aDY, aDX) + Math.PI / 2
  const aSegScale = aSegLength / 6
  //
  const aLineWire0 = new THREE.LineCurve3(
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 1, 0)
  )
  //
  const aLineWire1 = new THREE.LineCurve3(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, -3, 0)
  )
  //
  // path,segments,radiius,closed
  const aGeoWire0 = new THREE.TubeGeometry(
    aLineWire0,
    64, //segments in extrusion
    0.1, //radius of tube
    8, //segments around tube
    false
  )
  //
  const aGeoCathode0 = new THREE.CylinderGeometry(
    1, //radiusTop
    1, //radiusBottom
    0.2 //height
  )
  //
  const aGeoAnode1 = new THREE.ConeGeometry(
    1, //radius
    2 //height
  )
  //
  const aGeoWire1 = new THREE.TubeGeometry(
    aLineWire1,
    64, //segments in extrusion
    0.1, //radius of tube
    8, //segments around tube
    false
  )
  //
  const aCount = circuit.count
  const aColor0 = channelColor(aN0N, aCount)
  const aColor1 = channelColor(aN1N, aCount)
  //
  /**
   * Sense the state of this LED based on Sources.
   */
  const senseSources = () => {
    try {
      if (aS0 == null || aS1 == null) {
        return
      }
      const aState0 = aS0.states[aS0.stateNo]
      const aState1 = aS1.states[aS1.stateNo]
      led.stateNo = aState0 == '0' && aState1 == '1' ? 1 : 0
    } catch (theErr) {
      logDebug('Error: Rled.jsx: senseSources. ${theErr}')
    }
  }
  //
  const setLight = () => {
    aCircleRef.current.material.color = ledcolors[led.stateNo]
  }
  //
  useFrame(() => {
    senseSources()
    setLight()
  })
  //
  const doClick = () => {
    try {
      if (aS0 == null || aS1 == null) {
        return
      }
      aS0.stateNo = 1 // "0"
      aS1.stateNo = 2 // "1"
    } catch (theErr) {
      logDebug('Error: Rled.jsx: doClick. ${theErr}')
    }
  }
  //
  //    |  0
  //   --- 0 cathode
  //   /|\ 1 anode
  //    |  1
  //
  // <group scale={[aSegScale, aSegScale, aSegScale]} rotation-z={aSegAngle}>
  return (
    <>
      <group position={[aNCX, aNCY, 0]}>
        <group scale={[aSegScale, aSegScale, aSegScale]} rotation-z={aSegAngle}>
          <mesh geometry={aGeoWire0} position={[0, 0, 0]}>
            <meshBasicMaterial color={aColor0} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={aGeoCathode0} position={[0, 1, 0]}>
            <meshBasicMaterial color={aColor0} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={aGeoAnode1} position={[0, 0, 0]}>
            <meshBasicMaterial color={aColor1} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={aGeoWire1} position={[0, 0, 0]}>
            <meshBasicMaterial color={aColor1} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, -0.1]} ref={aCircleRef} onClick={doClick}>
            <circleGeometry args={[2.5]} />
            <meshBasicMaterial
              color={ledcolors[led.stateNo]}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </>
  )
  //
}
//
