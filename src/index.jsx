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
function Top1() {
  console.log('Top1.')
  //
  return (
    <>
      <Top2 />
    </>
  )
}

function Top2() {
  console.log('Top2.')
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
        <Top3 resetref={aResetRef} />
      </Canvas>
    </StrictMode>
  )
}
//
//
