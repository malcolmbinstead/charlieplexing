//
import { Obj, Node, Source, Resist, Wire, Led, Circuit, crossLink } from './Parts.js'
//
//
const LED_CATHODE = 0
const LED_ANODE = 1
/**
 * Create all the sources and their nodes.
 * @param {*} theCircuit
 */
function makeSources(theCircuit) {
  try {
    //
    for (let aI = 0; aI < theCircuit.count; aI++) {
      //
      const aN0 = new Node()
      const aN1 = new Node()
      const aSource = new Source()
      //
      aN0.obj.set(0, aI, 0, aI)
      aN1.obj.set(0, aI, 0.5, aI)
      //
      crossLink(aN0, aSource)
      crossLink(aN1, aSource)
      //
      theCircuit.nodes.push(aN0)
      theCircuit.nodes.push(aN1)
      theCircuit.sources.push(aSource)
      //
    }
    //
  } catch (theErr) {
    console.log('Error: makeSources: ', theErr)
  }
}
//
/**
 * Create all the resists and their nodes.
 * @param {*} theCircuit
 */
function makeResists(theCircuit) {
  try {
    //
    for (let aI = 0; aI < theCircuit.count; aI++) {
      //
      const aN0 = new Node()
      const aN1 = new Node()
      const aResist = new Resist()
      //
      aN0.obj.set(1, aI, 1, aI)
      aN1.obj.set(1, aI, 1.5, aI)
      //
      crossLink(aN0, aResist)
      crossLink(aN1, aResist)
      //
      theCircuit.nodes.push(aN0)
      theCircuit.nodes.push(aN1)
      theCircuit.resists.push(aResist)
      //
    }
    //
  } catch (theErr) {
    console.log('Error: makeResists: ', theErr)
  }
}
//
/**
 * Create all the led nodes.
 * NB: the node 'n' values will need to be set.
 * @param {*} theCircuit
 */
function makeLeds(theCircuit) {
  try {
    //
    const aColumnCount = theCircuit.count
    const aRowCount = aColumnCount - 1
    //
    for (let aY = 0; aY < aRowCount; aY++) {
      for (let aX = 0; aX < aColumnCount; aX++) {
        //
        const aN0 = new Node()
        const aN1 = new Node()
        const aLed = new Led()
        //
        crossLink(aN1, aLed) //cathode - links[0]
        crossLink(aN0, aLed) //anode
        //
        aN0.obj.set(0, -1, 2.25 + aX, 1 + aY)
        aN1.obj.set(0, -1, 3 + aX, 1.75 + aY)
        //
        theCircuit.nodes.push(aN0)
        theCircuit.nodes.push(aN1)
        theCircuit.leds.push(aLed)
        //
      }
    }
    //
  } catch (theErr) {
    console.log('Error: makeLeds: ', theErr)
  }
}
//
/**
 * Create the starting path.
 * add wires
 * add links to led anodes
 * add final node
 * add wire.
 * @param {*} theCircuit
 * @param {*} theIndex the channel
 * @returns returns the final node of path
 */
function makePathBase(theCircuit, theIndex) {
  let aReturn_Node = null
  try {
    //
    const aSource = theCircuit.sources[theIndex]
    const aResist = theCircuit.resists[theIndex]
    //
    const aSR_Wire = new Wire()
    crossLink(aSource.links[1], aSR_Wire)
    crossLink(aResist.links[0], aSR_Wire)
    theCircuit.wires.push(aSR_Wire)
    //
    const aColumnCount = theCircuit.count
    //
    const aLeds = theCircuit.leds
    let aLast_Node = aResist.links[1]
    //
    if (theIndex > 0) {
      //
      const aBaseLedIndex = aColumnCount * (theIndex - 1)
      //
      for (let aI = 0; aI < theIndex; aI++) {
        const aLed = aLeds[aBaseLedIndex + aI]
        const aLA_Node = aLed.links[LED_ANODE]
        const aLA_Wire = new Wire()
        crossLink(aLast_Node, aLA_Wire)
        crossLink(aLA_Node, aLA_Wire)
        theCircuit.wires.push(aLA_Wire)
        aLA_Node.obj.n = theIndex
        //
        aLast_Node = aLA_Node
        //
      }
    }
    //
    const aFinal_Node = new Node()
    aFinal_Node.obj.set(0, theIndex, 1.75 + theIndex, theIndex)
    const aFinal_Wire = new Wire()
    crossLink(aLast_Node, aFinal_Wire)
    crossLink(aFinal_Node, aFinal_Wire)
    theCircuit.wires.push(aFinal_Wire)
    theCircuit.nodes.push(aFinal_Node)
    //
    aReturn_Node = aFinal_Node
    //
  } catch (theErr) {
    console.log('Error: makePathBase: ', theErr)
  }
  return aReturn_Node
}
//
/**
 * create a diagonal path
 * add node
 * add wire
 * @param {*} theCircuit
 * @param {*} theIndex
 * @param {*} theLastNode starting node
 * @returns returns the new final node
 */
function makePathSlant(theCircuit, theIndex, theStart_Node) {
  let aReturn_Node = null
  try {
    //
    const aFinal_Node = new Node()
    aFinal_Node.obj.set(0, theIndex, 3 + theIndex, 1 + theIndex)
    const aFinal_Wire = new Wire()
    crossLink(theStart_Node, aFinal_Wire)
    crossLink(aFinal_Node, aFinal_Wire)
    theCircuit.wires.push(aFinal_Wire)
    theCircuit.nodes.push(aFinal_Node)
    //
    aReturn_Node = aFinal_Node
    //
  } catch (theErr) {
    console.log('Error: makePathSlant: ', theErr)
  }
  return aReturn_Node
}
//
/**
 * creates a path up
 * and wires
 * add links to led cathodes
 * @param {*} theCircuit
 * @param {*} theIndex
 * @param {*} theStart_Node starting node
 */
function makePathUp(theCircuit, theIndex, theStart_Node) {
  try {
    const aColumnCount = theCircuit.count
    const aRowCount = aColumnCount - 1
    const aLeds = theCircuit.leds
    let aLast_Node = theStart_Node
    //
    for (let aI = theIndex; aI < aRowCount; aI++) {
      const aBaseLedIndex = aColumnCount * aI
      const aLed = aLeds[aBaseLedIndex + theIndex]
      const aLC_Node = aLed.links[LED_CATHODE]
      const aWire = new Wire()
      crossLink(aLast_Node, aWire)
      crossLink(aLC_Node, aWire)
      theCircuit.wires.push(aWire)
      aLC_Node.obj.n = theIndex
      //
      aLast_Node = aLC_Node
      //
    }
  } catch (theErr) {
    console.log('Error: makePathUp: ', theErr)
  }
}
//
/**
 * creates a path down
 * add nodes
 * and wires
 * add links to led cathodes
 * @param {*} theCircuit
 * @param {*} theIndex
 * @param {*} theStart_Node starting node
 */
function makePathDown(theCircuit, theIndex, theStart_Node) {
  try {
    const aColumnCount = theCircuit.count
    const aRowCount = aColumnCount - 1
    const aLeds = theCircuit.leds
    let aLast_Node = theStart_Node
    //
    if (theIndex > 0) {
      for (let aI = theIndex; aI > 0; aI--) {
        const aII = aI - 1
        const aBaseLedIndex = aColumnCount * aII
        const aLed = aLeds[aBaseLedIndex + theIndex]
        const aLC_Node = aLed.links[LED_CATHODE]
        const aWire = new Wire()
        crossLink(aLast_Node, aWire)
        crossLink(aLC_Node, aWire)
        theCircuit.wires.push(aWire)
        aLC_Node.obj.n = theIndex
        //
        aLast_Node = aLC_Node
        //
      }
    }
  } catch (theErr) {
    console.log('Error: makePathDown: ', theErr)
  }
}
/**
 * Create a path to the right
 * add nodes
 * add wires
 * add links to led anodes
 * @param {*} theCircuit
 * @param {*} theIndex
 * @param {*} theStart_Node starting node
 */
function makePathAcross(theCircuit, theIndex, theStart_Node) {
  try {
    const aColumnCount = theCircuit.count
    const aRowCount = aColumnCount - 1
    const aLeds = theCircuit.leds
    let aLast_Node = theStart_Node
    //
    const aBaseLedIndex = aColumnCount * theIndex
    for (let aI = theIndex; aI < aColumnCount - 1; aI++) {
      const aLed = aLeds[aBaseLedIndex + aI + 1]
      const aLA_Node = aLed.links[LED_ANODE]
      const aWire = new Wire()
      crossLink(aLast_Node, aWire)
      crossLink(aLA_Node, aWire)
      theCircuit.wires.push(aWire)
      aLA_Node.obj.n = theIndex
      //
      aLast_Node = aLA_Node
      //
    }
  } catch (theErr) {
    console.log('Error: makePathAcross: ', theErr)
  }
}
//
/**
 * Each path will have a base section that leads up to the slant.
 * Each path will have a slanted section.
 * Each path will have three sections that follow the slant,
 * one going up, one going down and one going across.
 * @param {*} theCircuit
 * @param {*} theIndex
 */
function makePath(theCircuit, theIndex) {
  try {
    //
    const aNode0 = makePathBase(theCircuit, theIndex)
    const aNode1 = makePathSlant(theCircuit, theIndex, aNode0)
    //
    theCircuit.xnodes.push(aNode1) // Node for clarity
    //
    makePathUp(theCircuit, theIndex, aNode1)
    makePathDown(theCircuit, theIndex, aNode1)
    makePathAcross(theCircuit, theIndex, aNode1)
    //
  } catch (theErr) {
    console.log('Error: makePath: ', theErr)
  }
}
//
/**
 * Create a path for every source.
 * @param {*} theCircuit
 */
function makePaths(theCircuit) {
  try {
    //
    for (let aI = 0; aI < theCircuit.count; aI++) {
      makePath(theCircuit, aI)
    }
    //
  } catch (theErr) {
    console.log('Error: makePaths: ', theErr)
  }
}
//
/**
 *
 * @param {*} theCount
 * @returns
 */
export function buildCircuit2(theCount = 16) {
  let aCircuit = new Circuit()
  try {
    //
    if (theCount < 2 || theCount > 128) {
      throw new Error(`bad value theCount = ${theCount}`)
    }
    //
    aCircuit.count = theCount
    //
    makeSources(aCircuit)
    makeResists(aCircuit)
    makeLeds(aCircuit)
    //
    makePaths(aCircuit)
    //
    aCircuit.calcLimits()
    //
  } catch (theErr) {
    console.log('Error buildCircuit2 ', theErr)
    aCircuit = new Circuit()
  }
  return aCircuit
}
//
