//
import { useControls } from 'leva'
import { getField } from './utils.js'
//
import Layout1 from './Layout1.jsx'
import Layout2 from './Layout2.jsx'
import Layout3 from './Layout3.jsx'
import Layout4 from './Layout4.jsx'
//
export default function TopLayout({ ResetRef: theResetRef }) {
  console.log('TopLayout')
  //
  const aDefLayout = getField('Layout', 'circuit1')
  const aDefOrientation = getField('Orientation', 0)
  const aDefScanning = getField('Scanning', 'stopped')
  //
  // Layout
  const { Layout: aLayout } = useControls({
    Layout: {
      value: aDefLayout, // starting value
      options: {
        circuit1: 'circuit1',
        circuit2: 'circuit2',
        circuit3: 'circuit3',
        circuit4: 'circuit4'
      }
    }
  })
  //
  // Orientation
  const { Orientation: aOrientation } = useControls({
    Orientation: {
      value: aDefOrientation, // starting value
      min: 0,
      max: 1,
      step: 1
    }
  })
  //
  // Scanning
  const { Scanning: aScanning } = useControls({
    Scanning: {
      value: aDefScanning, // starting value
      options: { stopped: 'stopped', slow: 'slow', fast: 'fast' }
    }
  })
  //
  //
  let aReturn = <></>
  if (aLayout == 'circuit1') {
    aReturn = <Layout1 ResetRef={theResetRef} Orientation={aOrientation} Scanning={aScanning} />
  }
  if (aLayout == 'circuit2') {
    aReturn = <Layout2 ResetRef={theResetRef} Orientation={aOrientation} Scanning={aScanning} />
  }
  if (aLayout == 'circuit3') {
    aReturn = <Layout3 ResetRef={theResetRef} Orientation={aOrientation} Scanning={aScanning} />
  }
  if (aLayout == 'circuit4') {
    aReturn = <Layout4 ResetRef={theResetRef} Orientation={aOrientation} Scanning={aScanning} />
  }
  //
  return aReturn
  //
}
