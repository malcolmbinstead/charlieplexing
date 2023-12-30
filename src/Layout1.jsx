//
import { useControls } from 'leva'
import { getField } from './utils.js'
import { buildCircuit1b } from './Circuit1b.js'
import DrawLayout from './DrawLayout.jsx'
//
export default function Layout1({ ResetRef: theResetRef, Orientation: theOrientation, Scanning: theScanning }) {
  console.log('Layout1')
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
  let aCircuit = buildCircuit1b(aCount)
  //
  return <DrawLayout ResetRef={theResetRef} Circuit={aCircuit} Orientation={theOrientation} Scanning={theScanning} />
  //
}
