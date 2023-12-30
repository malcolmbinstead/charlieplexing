//
import { useControls } from 'leva'
import { getField } from './utils.js'
import { buildCircuit2 } from './Circuit2.js'
import DrawLayout from './DrawLayout.jsx'
//
export default function Layout2({ ResetRef: theResetRef, Orientation: theOrientation, Scanning: theScanning }) {
  console.log('Layout2')
  //
  const aDefCount = getField('Count', 4)
  //
  // Count
  const { Count: aCount } = useControls({
    Count: {
      value: aDefCount, // starting value
      min: 2,
      max: 16,
      step: 1
    }
  })
  //
  //
  let aCircuit = buildCircuit2(aCount)
  //
  return <DrawLayout ResetRef={theResetRef} Circuit={aCircuit} Orientation={theOrientation} Scanning={theScanning} />
  //
}
