//
import * as THREE from 'three'
//
const itsWhite = new THREE.Color('white')
const itsDebug = false
//
export function getWhite() {
  return itsWhite
}
//
export function channelColor(theN, theCount) {
  let aColor = getWhite()
  try {
    if (theN >= 0) {
      const aColorAngle = (theN / theCount) * 300
      aColor = new THREE.Color(`hsl(${aColorAngle}, 100%, 50%)`)
    }
  } catch (theErr) {
    //
  }
  return aColor
}
//
export function getDebug() {
  return itsDebug
}
//
export function logDebug(theStr) {
  //
  try {
    if (itsDebug) {
      console.log(theStr)
    }
  } catch (theErr) {
    //
  }
}
//
export function clamp(theV,theMin,theMax){
  const aMin = Math.min(theMin,theMax)
  const aMax = Math.max(theMin,theMax)
  theV = Math.max(theV,aMin)
  theV = Math.min(theV,aMax)
  return theV
}
//
