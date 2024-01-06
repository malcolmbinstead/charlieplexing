//
import { useControls } from 'leva'
import { getField } from './utils.js'
import { buildCircuit4 } from './Circuit4.js'
import DrawLayout from './DrawLayout.jsx'
//
//
export default function Layout4({ ResetRef: theResetRef, Orientation: theOrientation, Scanning: theScanning }) {
  console.log('Layout4')
  //
  const aDefVCount = getField('VCount', 1)
  const aDefECount = getField('ECount', 4)
  //
  // VCount
  const { VCount: aVCount } = useControls({
    VCount: {
      value: aDefVCount, // starting value
      min: 1,
      max: 8,
      step: 1
    }
  })
  //
  // ECount
  const { ECount: aECount } = useControls({
    ECount: {
      value: aDefECount, // starting value
      min: 1,
      max: 8,
      step: 1
    }
  })
  //
  //
  let aCircuit = buildCircuit4(aVCount, aECount)
  //
  return <DrawLayout ResetRef={theResetRef} Circuit={aCircuit} Orientation={theOrientation} Scanning={theScanning} />
  //
}
//