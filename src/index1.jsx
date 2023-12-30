//
import './style.css'
//
import ReactDOM from 'react-dom/client'
//
import { StrictMode, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, MapControls } from '@react-three/drei'
import Instructions from './Instructions.jsx'
//
import TopLayout from './TopLayout.jsx'
//
const root = ReactDOM.createRoot(document.querySelector('#root'))
//
root.render(<Top1 />)
//
//
function Top1() {
  console.log('Top1.')
  //
  const aResetRef = useRef(0)
  //
  const doPointerMissed = (event) => {
    //event.stopPropagation()
    console.log("missed")
    aResetRef.current++
  }
  //
  const aDA = 0
  const aAzimuthAngle = 0
  const aPolarAngle = Math.PI / 2
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
        <TopLayout ResetRef={aResetRef}/>
      </Canvas>
    </StrictMode>
  )
  //
}
//
