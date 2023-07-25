//
import {
  Obj,
  Node,
  Source,
  Resist,
  Wire,
  Led,
  Circuit,
  crossLink
} from './Parts.js'
//
function led0(theCircuit){
  //
  const aN0 = new Node()
  const aN1 = new Node()
  const aLed = new Led()
  //
  aN0.obj.set(0, 0, 0, 1)//red
  aN1.obj.set(0, 1, 0, 2)//green
  //
  // first cross link is cathode.
  crossLink(aN0, aLed) 
  crossLink(aN1, aLed) 
  //
  theCircuit.nodes.push(aN0)
  theCircuit.nodes.push(aN1)
  theCircuit.leds.push(aLed)
  //
}
//
function led1(theCircuit){
  //
  const aN0 = new Node()
  const aN1 = new Node()
  const aLed = new Led()
  //
  aN0.obj.set(0, 0, 1, 0)//red
  aN1.obj.set(0, 1, 2, 0)//green
  //
  // first cross link is cathode.
  crossLink(aN0, aLed) 
  crossLink(aN1, aLed) 
  //
  theCircuit.nodes.push(aN0)
  theCircuit.nodes.push(aN1)
  theCircuit.leds.push(aLed)
  //
}
//
function led2(theCircuit){
  //
  const aN0 = new Node()
  const aN1 = new Node()
  const aLed = new Led()
  //
  aN0.obj.set(0, 0, 1, 1)//red
  aN1.obj.set(0, 1, 2, 2)//green
  //
  // first cross link is cathode.
  crossLink(aN0, aLed) 
  crossLink(aN1, aLed) 
  //
  theCircuit.nodes.push(aN0)
  theCircuit.nodes.push(aN1)
  theCircuit.leds.push(aLed)
  //
}
//
export function buildCircuit0(theCount = 16) {
  let aCircuit = new Circuit()
  try {
    //
    aCircuit.count = 2
    //
    led0(aCircuit)
    led1(aCircuit)
    led2(aCircuit)
    //
    aCircuit.calcLimits()
    //
  } catch (theErr) {
    console.log('Error buildCircuit0 ', theErr)
    aCircuit = new Circuit()
  }
  return aCircuit
}
//
