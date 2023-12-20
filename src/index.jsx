//
import './style.css'
//
import ReactDOM from 'react-dom/client'
//
import { StrictMode, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, MapControls } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import Instructions from './Instructions.jsx'
//
import Top3 from './Top3.jsx'
//
const root = ReactDOM.createRoot(document.querySelector('#root'))
//
root.render(<Top1 />)
//
//
let itsSearcher = null
//
function getSearcher() {
  if (itsSearcher == null) {
    itsSearcher = new URLSearchParams(window.location.search)
  }
  return itsSearcher
}
//
function getField(theField, theDefault) {
  let aReturn = theDefault
  try {
    const aSearcher = getSearcher()
    if (aSearcher.has(theField)) {
      const aValue = aSearcher.get(theField)
      if (typeof theDefault == 'number') {
        const aParsed = parseInt(aValue)
        if (!isNaN(aParsed)) {
          aReturn = aParsed
        }
      } else {
        aReturn = aValue
      }
    }
  } catch (theErr) {}
  return aReturn
}
//
//
function Top1() {
  //
  console.log('Top1.')
  const aLayout = getField('Layout', 'circuit1')
  const aRotation = getField('Rotation', 0)
  const aScanning = getField('Scanning', 'stopped')
  const aCount1 = getField('Count1', 4)
  const aCount2 = getField('Count2', 4)
  const aVCount3 = getField('VCount3', 2)
  const aECount3 = getField('ECount3', 2)
  //
  return (
    <>
      <Top2 defLayout={aLayout} defRotation={aRotation} defScanning={aScanning} defCount1={aCount1} defCount2={aCount2} defVCount3={aVCount3} defECount3={aECount3} />
    </>
  )
}
//
//
function Top2({ defLayout, defRotation, defScanning, defCount1, defCount2, defVCount3, defECount3 }) {
  console.log('Top2.')
  //
  const aResetRef = useRef(0)
  //
  const doPointerMissed = (event) => {
    //event.stopPropagation()
    aResetRef.current++
  }
  //
  const aDA = 0
  const aAzimuthAngle = 0
  const aPolarAngle = Math.PI / 2
  //
  //
  return (
    <StrictMode>
      <Instructions />
      <Canvas
        dpr={[1, 2]}
        onPointerMissed={doPointerMissed}
        orthographic
        camera={{
          position: [0, 0, 100],
          zoom: 100,
          up: [0, 1, 0],
          far: 1000
        }}>
        <OrbitControls
          makeDefault
          minAzimuthAngle={aAzimuthAngle - aDA}
          maxAzimuthAngle={aAzimuthAngle + aDA}
          minPolarAngle={aPolarAngle - aDA}
          maxPolarAngle={aPolarAngle + aDA}
        />
        <Top3
          resetref={aResetRef}
          defRotation={defRotation}
          defLayout={defLayout}
          defScanning={defScanning}
          defCount1={defCount1}
          defCount2={defCount2}
          defVCount3={defVCount3}
          defECount3={defECount3}
        />
      </Canvas>
    </StrictMode>
  )
}
//
//
