//
import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useFrame } from '@react-three/fiber'
import Rsource from './Rsource.jsx'
import Rresist from './Rresist.jsx'
import Rwire from './Rwire.jsx'
import Rled from './Rled.jsx'
import Rnode from './Rnode.jsx'
//
//
export default function DrawLayout({ ResetRef: theResetRef, Circuit: theCircuit, Orientation: theOrientation, Scanning: theScanning }) {
  console.log('DrawLayout')
  //
  const aRotation = (Math.PI / 2) * theOrientation
  //
  const aTimerRef = useRef(0)
  const aScanRef = useRef(-1)
  //
  const aWires = theCircuit.wires
  const aSources = theCircuit.sources
  const aResists = theCircuit.resists
  const aLeds = theCircuit.leds
  const aNodes = theCircuit.nodes
  const aXNodes = theCircuit.xnodes
  //
  const aCX = (theCircuit.xmin + theCircuit.xmax) / 2
  const aCY = (theCircuit.ymin + theCircuit.ymax) / 2
  const aW = theCircuit.xmax - theCircuit.xmin
  const aH = theCircuit.ymax - theCircuit.ymin
  const aScaleX = 5 / (aW + 1)
  const aScaleY = 5 / (aH + 1)
  //const aScale = (aRotation & 1) == 0 ? aScaleY : aScaleX
  const aScale = aScaleX
  //
  const aZTex = useLoader(TextureLoader, './images/z.jpg')
  const a0Tex = useLoader(TextureLoader, './images/0.jpg')
  const a1Tex = useLoader(TextureLoader, './images/1.jpg')
  const aSourceTexs = [aZTex, a0Tex, a1Tex]
  //
  const aOffColor = new THREE.Color('black')
  const aOnColor = new THREE.Color('white')
  const aLedColors = [aOffColor, aOnColor]
  //
  //
  const clearAllSources = () => {
    try {
      const aList = aSources
      const aCount = aList.length
      for (let aI = 0; aI < aCount; aI++) {
        const aItem = aList[aI]
        aItem.stateNo = 0
      }
    } catch (theErr) {
      console.log('Error clearAllSources ', theErr)
    }
  }
  //
  const scanItem = (theNo) => {
    try {
      const aLed = aLeds[theNo]
      const aL0 = aLed.links[0]
      const aL1 = aLed.links[1]
      const aC0 = aL0.obj.n
      const aC1 = aL1.obj.n
      const aS0 = aSources[aC0]
      const aS1 = aSources[aC1]
      aS0.stateNo = 1 // "0"
      aS1.stateNo = 2 // "1"
    } catch (theErr) {
      console.log('Error scanItem ', theErr)
    }
  }
  //
  const advanceScan = () => {
    try {
      aTimerRef.current = 0
      const aCount = aLeds.length
      aScanRef.current++
      aScanRef.current %= aCount
      clearAllSources()
      scanItem(aScanRef.current)
    } catch (theErr) {
      console.log('Error advanceScan ', theErr)
    }
  }
  //
  // update when the frame is about to be rerendered.
  useFrame((state, delta, xrFrame) => {
    try {
      if (theResetRef.current != 0) {
        theResetRef.current = 0
        clearAllSources()
      }
      if (theScanning == 'stopped') {
        aTimerRef.current = 0
      } else {
        aTimerRef.current += delta
        if (theScanning == 'slow') {
          if (aTimerRef.current > 1) {
            advanceScan()
          }
        } else {
          if (aTimerRef.current > 0.1) {
            advanceScan()
          }
        }
      }
    } catch (theErr) {
      console.log('Error useFrame ', theErr)
    }
  })
  //
  let aShowNodes = <Rnodes circuit={theCircuit} nodes={aNodes} />
  aShowNodes = <></>
  //
  return (
    <group rotation={[0, 0, aRotation]}>
      <group scale={[aScale, aScale, 1]}>
        <group position={[-aCX, -aCY, 0]}>
          <Rsources circuit={theCircuit} sources={aSources} sourcetexs={aSourceTexs} />
          <Rwires circuit={theCircuit} wires={aWires} />
          <Rresists circuit={theCircuit} resists={aResists} />
          <Rleds circuit={theCircuit} leds={aLeds} ledcolors={aLedColors} />
          <Rnodes circuit={theCircuit} nodes={aXNodes} />
          {aShowNodes}
        </group>
      </group>
    </group>
  )
  //
}
// <Rnodes circuit={aCircuit} nodes={aNodes} />
//
//
function Rsources({ circuit, sources, sourcetexs }) {
  //
  console.log('Rsources.')
  //
  return (
    <>
      {sources.map((source, index) => (
        <Rsource key={source.id} circuit={circuit} source={source} sourcetexs={sourcetexs} />
      ))}
    </>
  )
  //
}
//
//
function Rwires({ circuit, wires }) {
  //
  console.log('Rwires.')
  //
  return (
    <>
      {wires.map((wire, index) => (
        <Rwire key={wire.id} circuit={circuit} wire={wire} />
      ))}
    </>
  )
  //
}
//
//
function Rresists({ circuit, resists }) {
  //
  console.log('Rresists.')
  //
  return (
    <>
      {resists.map((resist, index) => (
        <Rresist circuit={circuit} key={resist.id} resist={resist} />
      ))}
    </>
  )
  //
}
//
//
function Rleds({ circuit, leds, ledcolors }) {
  //
  console.log('Rleds.')
  //
  return (
    <>
      {leds.map((led, index) => (
        <Rled key={led.id} circuit={circuit} led={led} ledcolors={ledcolors} />
      ))}
    </>
  )
  //
}
//
//
function Rnodes({ circuit, nodes }) {
  //
  console.log('Rnodes.')
  //
  return (
    <>
      {nodes.map((node, index) => (
        <Rnode key={node.id} circuit={circuit} node={node} />
      ))}
    </>
  )
  //
}
//
//
