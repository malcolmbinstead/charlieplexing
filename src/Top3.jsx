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
import { buildCircuit3 } from './Circuit3.js'
//
import Rsource from './Rsource.jsx'
import Rresist from './Rresist.jsx'
import Rwire from './Rwire.jsx'
import Rled from './Rled.jsx'
import Rnode from './Rnode.jsx'
//
//import Rpopup from './Rpopup.jsx'
//
export default function Top3({ resetref, defLayout, defRotation, defScanning, defCount1, defCount2, defVCount3, defECount3 }) {
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
      options: { circuit1: 'circuit1', circuit2: 'circuit2', circuit3: 'circuit3' }
    }
  })
  //
  // Rotation
  const { Rotation: aRotation } = useControls({
    Rotation: {
      value: defRotation, // starting value
      min: 0,
      max: 3,
      step: 1
    }
  })
  const aRotRad = (Math.PI / 2) * aRotation
  //
  // Scan mode.
  const { Scanning: aScanning } = useControls({
    Scanning: {
      value: defScanning, // starting value
      options: { stopped: 'stopped', running: 'running' }
    }
  })
  //
  // How many wires to use for circuit1
  const { Count1: aCount1 } = useControls({
    Count1: {
      value: defCount1, // starting value
      min: 2,
      max: 16,
      step: 1
    }
  })
  const { Count2: aCount2 } = useControls({
    Count2: {
      value: defCount2, // starting value
      min: 2,
      max: 16,
      step: 1
    }
  })
  const { VCount3: aVCount3 } = useControls({
    VCount3: {
      value: defVCount3, // starting value
      min: 1,
      max: 8,
      step: 1
    }
  })
  const { ECount3: aECount3 } = useControls({
    ECount3: {
      value: defECount3, // starting value
      min: 1,
      max: 8,
      step: 1
    }
  })
  //
  //
  let aCircuit = buildCircuit0()
  //
  if (aLayout == 'circuit1') {
    aCircuit = buildCircuit1b(aCount1)
  }
  //
  if (aLayout == 'circuit2') {
    aCircuit = buildCircuit2(aCount2)
  }
  //
  if (aLayout == 'circuit3') {
    aCircuit = buildCircuit3(aVCount3, aECount3)
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
  const aH = aCircuit.ymax - aCircuit.ymin
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
  let aShowNodes = <Rnodes circuit={aCircuit} nodes={aNodes} />
  aShowNodes = <></>
  //
  return (
    <group rotation={[0, 0, aRotRad]}>
      <group scale={[aScale, aScale, 1]}>
        <group position={[-aCX, -aCY, 0]}>
          <Rsources circuit={aCircuit} sources={aSources} sourcetexs={aSourceTexs} />
          <Rwires circuit={aCircuit} wires={aWires} />
          <Rresists circuit={aCircuit} resists={aResists} />
          <Rleds circuit={aCircuit} leds={aLeds} ledcolors={aLedColors} />
          {aShowNodes}
        </group>
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
