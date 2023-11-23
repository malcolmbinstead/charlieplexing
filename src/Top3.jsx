//
//  https://binsteadsystems.com/app/charlieplex1/
//
//  github deployment:
//  https://sbcode.net/react-three-fiber/host-github-pages/
//  https://www.youtube.com/watch?v=2hM5viLMJpA
//  https://create-react-app.dev/docs/deployment/
//
import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
//
//
import { buildCircuit0 } from './Circuit0.js'
//import { buildCircuit1 } from './Circuit1.js'
import { buildCircuit1b } from './Circuit1b.js'
import { buildCircuit2 } from './Circuit2.js'
//
import Rsource from './Rsource.jsx'
import Rresist from './Rresist.jsx'
import Rwire from './Rwire.jsx'
import Rled from './Rled.jsx'
import Rnode from './Rnode.jsx'
//
//import Rpopup from './Rpopup.jsx'
//
export default function Top3({ resetref,defLayout,defWireCount,defScanning }) {
  //
  console.log('Top3.')
  //
  const aTimerRef = useRef(0)
  const aScanRef = useRef(-1)
  //
  // What circuit to use.
  const { Layout: aLayout } = useControls({
    Layout: {
      value: defLayout, // starting value
      options: { circuit1: 'circuit1', circuit2: 'circuit2' }
    }
  })
  //
  // How many wires to use.
  const { WireCount: aWireCount } = useControls({
    WireCount: {
      value: defWireCount, // starting value
      min: 2,
      max: 16,
      step: 1
    }
  })
  //
  // Scan mode.
  const { Scanning: aScanning } = useControls({
    Scanning: {
      value: defScanning, // starting value
      options: { stopped: 'stopped', running: 'running' }
    }
  })
  //
  let aCircuit = buildCircuit0()
  //
  if (aLayout == 'circuit1') {
    aCircuit = buildCircuit1b(aWireCount)
  }
  //
  if (aLayout == 'circuit2') {
    aCircuit = buildCircuit2(aWireCount)
  }
  //
  const aWires = aCircuit.wires
  const aSources = aCircuit.sources
  const aResists = aCircuit.resists
  const aLeds = aCircuit.leds
  const aNodes = aCircuit.nodes
  //
  const aCX = (aCircuit.xmin + aCircuit.xmax) / 2
  const aCY = (aCircuit.ymin + aCircuit.ymax) / 2
  const aW = aCircuit.xmax - aCircuit.xmin
  const aScale = 5 / (aW + 1)
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
  const resetList = (theList) => {
    try {
      const aCount = theList.length
      for (let aI = 0; aI < aCount; aI++) {
        const aItem = theList[aI]
        aItem.stateNo = 0
      }
    } catch (theErr) {}
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
    } catch (theErr) {}
  }
  //
  // update when the frame is about to be rerendered.
  useFrame((state, delta, xrFrame) => {
    try {
      if (resetref.current != 0) {
        resetref.current = 0
        resetList(aSources)
      }
      if (aScanning == 'stopped') {
        aTimerRef.current = 0
      } else {
        aTimerRef.current += delta
        if (aTimerRef.current > 1) {
          aTimerRef.current = 0
          const aCount = aLeds.length
          aScanRef.current++
          aScanRef.current %= aCount
          resetList(aSources)
          scanItem(aScanRef.current)
        }
      }
    } catch (theErr) {}
  })
  //
  //
  return (
    <group scale={[aScale, aScale, 1]}>
      <group position={[-aCX, -aCY, 0]}>
        <Rsources circuit={aCircuit} sources={aSources} sourcetexs={aSourceTexs} />
        <Rwires circuit={aCircuit} wires={aWires} />
        <Rresists circuit={aCircuit} resists={aResists} />
        <Rleds circuit={aCircuit} leds={aLeds} ledcolors={aLedColors} />
        {/*<Rnodes circuit={aCircuit} nodes={aNodes} />*/}
      </group>
    </group>
  )
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
