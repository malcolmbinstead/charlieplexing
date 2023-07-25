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
/**
 * A Route is a collection of paths.
 * Each path is a collection of steps.
 */
class Route {
  //
  constructor(theCount, theN) {
    this.count = theCount
    this.n = theN
    try {
      //
      this.x4 = 0 // starting X4
      this.y4 = theN * 4 + 2 //starting Y4
      //
      this.y4min = 0
      this.y4max = this.count * 4
      //
      this.d = 0 // next step direction
      //
      this.path = []
      //
      // build the path.
      this.p() // start point.
      this.p4() //source cell
      this.p3() //resist cell
      this.d = (this.n & 1) == 0 ? -1 : 1
      this.p() // start of perm
      const aPermCount = theCount / 2
      for (let aP = 0; aP < aPermCount; aP++) {
        this.p4() // odd perm
        this.p4() // even perm
      }
      //
    } catch (theErr) {
      console.log('Error: Route: constructor: ', theErr)
    }
  }
  //
  p2() {
    this.p()
    this.p()
  }
  //
  p3() {
    this.p()
    this.p()
    this.p()
  }
  //
  p4() {
    this.p()
    this.p()
    this.p()
    this.p()
  }
  //
  p() {
    //
    let aX4 = this.x4
    let aY4 = this.y4
    //
    const aMin = this.y4min
    const aMax = this.y4max
    if (aY4 <= aMin || aY4 >= aMax) {
      if (aY4 <= aMin) {
        aY4 = aMin + 1
      } else {
        aY4 = aMax - 1
      }
    }
    //
    const aObj = new Obj(
      aX4, //x index
      this.n, //channel
      aX4 / 4, //x position
      aY4 / 4
    ) //y y position
    //
    this.path.push(aObj)
    //
    this.x4++
    //
    if (this.d != 0) {
      aY4 = this.y4
      aY4 += this.d
      if (aY4 >= aMin && aY4 <= aMax) {
        // in range.
        this.y4 = aY4
      } else {
        // out of range.
        if (aY4 < aMin) {
          this.d = 1
          this.y4 = aMin + 1
        } else {
          this.d = -1
          this.y4 = aMax - 1
        }
      }
    }
  }
  //
}
//
/**
 *
 * @param {*} theCount
 * @returns an array of 'theCount' route steps.
 */
function makeRoutes(theCount) {
  const aRoutes = []
  for (let aI = 0; aI < theCount; aI++) {
    const aRoute = new Route(theCount, aI)
    aRoutes.push(aRoute.path)
  }
  return aRoutes
}
//
function ySortSlice(theSlice) {
  let aReturn = []
  try {
    const aChannelCount = theSlice.length
    const aSlice = []
    for (let aCI = 0; aCI < aChannelCount; aCI++) {
      const aSample = theSlice[aCI]
      aSlice.push(aSample)
    }
    aSlice.sort(function (a, b) {
      return a.obj.y - b.obj.y
    })
    aReturn = aSlice
    //
  } catch (theErr) {
    console.log(`Error: ySortSlice: ${theErr}`)
    aReturn = []
  }
  return aReturn
}
//
//
/**
 * Add a new slice of nodes to the circuit.
 * @param {*} theRoutes 
 * @param {*} theCircuit 
 * @param {*} theIndex 
 */
function addNodes(theRoutes,theCircuit, theIndex) {
  try {
    const aCount = theRoutes.length
    const aNodes = []
    for (let aI = 0; aI < aCount; aI++) {
      const aRoute = theRoutes[aI]
      const aSample = aRoute[theIndex]
      const aNode = new Node()
      aNode.obj = aSample
      aNodes.push(aNode)
    }
    theCircuit.nodes.push(aNodes)
  } catch (theErr) {
    console.log(`Error: addNodes: ${theIndex} `, theErr)
  }
}
//
//
/**
 * Add a group of sources to the last slice of nodes added.
 * @param {*} theCircuit
 */
function addSources2(theCircuit) {
  const aNCount = theCircuit.nodes.length
  const aM2 = aNCount - 2
  const aM1 = aNCount - 1
  const aM2Nodes = theCircuit.nodes[aM2]
  const aM1Nodes = theCircuit.nodes[aM1]
  const aCount = aM1Nodes.length
  for (let aI = 0; aI < aCount; aI++) {
    const aN2 = aM2Nodes[aI]
    const aN1 = aM1Nodes[aI]
    const aSource = new Source()
    crossLink(aN2, aSource)
    crossLink(aN1, aSource)
    theCircuit.sources.push(aSource)
  }
}
//
/**
 * Add a group of resists between the last two node slices added.
 * @param {*} theCircuit
 */
function addResists2(theCircuit) {
  const aNCount = theCircuit.nodes.length
  const aM2 = aNCount - 2
  const aM1 = aNCount - 1
  const aM2Nodes = theCircuit.nodes[aM2]
  const aM1Nodes = theCircuit.nodes[aM1]
  const aCount = aM1Nodes.length
  for (let aI = 0; aI < aCount; aI++) {
    const aN2 = aM2Nodes[aI]
    const aN1 = aM1Nodes[aI]
    const aResist = new Resist()
    crossLink(aN2, aResist)
    crossLink(aN1, aResist)
    theCircuit.resists.push(aResist)
  }
}
//
/**
 * Add a group of wires between the last two node slices added.
 * @param {*} theCircuit
 */
function addWires2(theCircuit) {
  const aNCount = theCircuit.nodes.length
  const aM2 = aNCount - 2
  const aM1 = aNCount - 1
  const aM2Nodes = theCircuit.nodes[aM2]
  const aM1Nodes = theCircuit.nodes[aM1]
  const aCount = aM1Nodes.length
  for (let aI = 0; aI < aCount; aI++) {
    const aN2 = aM2Nodes[aI]
    const aN1 = aM1Nodes[aI]
    const aWire = new Wire()
    crossLink(aN2, aWire)
    crossLink(aN1, aWire)
    theCircuit.wires.push(aWire)
  }
}
//
/**
 * Add an odd group of leds to the last slice of nodes added.
 * @param {} theCircuit
 */
function addLedsOdd1(theCircuit) {
  const aNCount = theCircuit.nodes.length
  const aM1 = aNCount - 1
  const aM1Nodes = theCircuit.nodes[aM1]
  const aYM1Nodes = ySortSlice(aM1Nodes)
  const aCount = aM1Nodes.length
  const aLedCount = aCount / 2 - 1
  //
  for (let aL = 0; aL < aLedCount; aL++) {
    const aI0 = aL * 2 + 1
    const aI1 = aI0 + 1
    const aN2 = aYM1Nodes[aI0]
    const aN1 = aYM1Nodes[aI1]
    const aLed = new Led()
    crossLink(aN2, aLed)
    crossLink(aN1, aLed)
    theCircuit.leds.push(aLed)
  }
  //
}
//
/**
 * Add an even group of leds to the last slice of nodes added.
 * @param {} theCircuit
 */
function addLedsEven1(theCircuit) {
  const aNCount = theCircuit.nodes.length
  const aM1 = aNCount - 1
  const aM1Nodes = theCircuit.nodes[aM1]
  const aYM1Nodes = ySortSlice(aM1Nodes)
  const aCount = aM1Nodes.length
  const aLedCount = aCount / 2
  //
  for (let aL = 0; aL < aLedCount; aL++) {
    const aI0 = aL * 2
    const aI1 = aI0 + 1
    const aN2 = aYM1Nodes[aI0]
    const aN1 = aYM1Nodes[aI1]
    const aLed = new Led()
    crossLink(aN2, aLed)
    crossLink(aN1, aLed)
    theCircuit.leds.push(aLed)
  }
  //
}
//

//
/**
 * Static method to build a charlie-plex circuit.
 * Returns -
 * A list of nodes -
 *       a point within the circuit.
 *       It an XY coord.
 *       It has a list of component ids it is attached to.
 * A list of components -
 *       a component can be a 'source|wire|resist|led'
 *       a component can be connected to 1|2 nodes.
 * A 'source'
 *      A source has a 'state' it can be float|ground|positive|negative.
 *      A source is linked to 1 node.
 * A 'wire'
 *      A wire has minimal resistance.
 *      A wire is linked to 2 nodes.
 * A 'resist'
 *      A resist has a resitance of R.
 *      A resist is linked to 2 nodes.
 * A 'led'
 *      A led has a 'state' it can be forward|reverse|open|short.
 *      A resist is linked to 2 nodes.
 *
 * @param {*} theCount
 * @returns A cuircuit based on the supplied parameters.
 */
export function buildCircuit1(theCount = 16) {
  let aCircuit = new Circuit()
  try {
    //
    if (theCount < 2 || theCount > 128 || (theCount & 1) == 1) {
      throw new Error(`bad value theCount = ${theCount}`)
    }
    //
    aCircuit.count = theCount
    //
    const aRoutes = makeRoutes(theCount)
    //
    addNodes(aRoutes,aCircuit, 0)
    //1
    //2
    addNodes(aRoutes,aCircuit, 3)
    addSources2(aCircuit)
    //
    addNodes(aRoutes,aCircuit, 4)
    addWires2(aCircuit)
    addNodes(aRoutes,aCircuit, 5)
    addWires2(aCircuit)
    //6
    addNodes(aRoutes,aCircuit, 7)
    addResists2(aCircuit)
    //
    addNodes(aRoutes,aCircuit, 8)
    addWires2(aCircuit)
    //
    const aPermCount = theCount / 2
    let aX = 8
    //
    for (let aP = 0; aP < aPermCount; aP++) {
      //
      addNodes(aRoutes,aCircuit, aX + 1) //1 LEDS
      addWires2(aCircuit)
      addLedsOdd1(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 2) //2
      addWires2(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 3) //3 LEDS
      addWires2(aCircuit)
      addLedsOdd1(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 4) //4
      addWires2(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 5) //5 LEDS
      addWires2(aCircuit)
      addLedsEven1(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 6) //6
      addWires2(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 7) //7 LEDS
      addWires2(aCircuit)
      addLedsEven1(aCircuit)
      //
      addNodes(aRoutes,aCircuit, aX + 8) //8
      addWires2(aCircuit)
      //
      aX += 8
    }
    //
    aCircuit.calcLimits()
    //
  } catch (theErr) {
    console.log('Error buildCircuit1 ', theErr)
    aCircuit = new Circuit()
  }
  return aCircuit
}
//
//
