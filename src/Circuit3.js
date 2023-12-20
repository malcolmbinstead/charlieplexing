//
import { Obj, Node, Source, Resist, Wire, Led, Circuit, crossLink } from './Parts.js'
import { clamp } from './utils.js'
//
//
const VMAX = 8
const EMAX = 8
//
//
/*
 * A Track follows the path of a wire.
 * Edge wires correspond to a single source number.
 * V-wires are a pair of wires that share a common source number.
 * The wires move inside cells and a cell contains 4 steps.
 * Edge wires start moving diagonally one step after V-wires start moving diagonally.
 * Wires can move forward by only one step,
 * Wires can move diagonally by -1, 0 or +1 units.
 * V-wires are only allowed to bounce by one step after
 * reaching an edge limit and will not be involved with cross-overs.
 */
class Track {
  //
  /**
   *
   * @param {*} theN the channel
   * @param {*} theY the starting Y location
   * @param {*} theDY the starting sideways stepping
   * @param {*} theType the type of wire, "V" or "E".
   */
  constructor(theI, theN, theY, theDY, theType) {
    this.i = theI // the wire index
    this.n = theN // the channel index
    this.y = theY
    this.dy = theDY
    this.type = theType
    //
    this.x = 0
  }
  //
  static copy(theOther) {
    let aReturn = new Track(theOther.i, theOther.n, theOther.y, theOther.dy, theOther.type)
    aReturn.x = theOther.x
    return aReturn
  }
  //
  advance() {
    this.x += 1
  }
  //
  glide(theCount, theMin, theMax) {
    this.x += 1
    if (this.type == 'E' && theCount < 1) {
      return
    }
    this.y += this.dy
    if (theMin > this.y || this.y > theMax) {
      this.dy *= -1
      this.y += this.dy * 2
    }
  }
  //
}
//
class Path {
  //
  constructor() {
    this.path = []
  }
  //
  save(theTrack) {
    try {
      this.path.push(Track.copy(theTrack))
    } catch (theErr) {
      console.log('Error Circuit3:Tracker.save ', theErr)
    }
  }
  //
}
//
function addWireSegment(theCircuit, theSN0, theSN1) {
  try {
    //
    const aN0 = new Node()
    const aN1 = new Node()
    const aWire = new Wire()
    //
    aN0.obj.set(theSN0.i, theSN0.n, theSN0.x, theSN0.y)
    aN1.obj.set(theSN1.i, theSN1.n, theSN1.x, theSN1.y)
    //
    crossLink(aN0, aWire)
    crossLink(aN1, aWire)
    //
    theCircuit.nodes.push(aN0)
    theCircuit.nodes.push(aN1)
    theCircuit.wires.push(aWire)
    //
  } catch (theErr) {
    console.log('Error addWireSegment ', theErr)
  }
}
//
function addNode(theCircuit, theStep) {
  try {
    const aNode = new Node()
    aNode.obj.i = theStep.i
    aNode.obj.n = theStep.n
    aNode.obj.x = theStep.x
    aNode.obj.y = theStep.y
    theCircuit.nodes.push(aNode)
  } catch (theErr) {
    console.log('Error addNode ', theErr)
  }
}
//
function addSource(theCircuit, theStep0, theStep1) {
  try {
    //
    const aN0 = new Node()
    const aN1 = new Node()
    const aSource = new Source()
    //
    aN0.obj.set(theStep0.i, theStep0.n, theStep0.x, theStep0.y)
    aN1.obj.set(theStep1.i, theStep1.n, theStep1.x, theStep1.y)
    //
    crossLink(aN0, aSource)
    crossLink(aN1, aSource)
    //
    theCircuit.nodes.push(aN0)
    theCircuit.nodes.push(aN1)
    theCircuit.sources.push(aSource)
    //
  } catch (theErr) {
    console.log('Error addSource ', theErr)
  }
}
//
function addResist(theCircuit, theStep0, theStep1) {
  try {
    //
    const aN0 = new Node()
    const aN1 = new Node()
    const aResist = new Resist()
    //
    aN0.obj.set(theStep0.i, theStep0.n, theStep0.x, theStep0.y)
    aN1.obj.set(theStep1.i, theStep1.n, theStep1.x, theStep1.y)
    //
    crossLink(aN0, aResist)
    crossLink(aN1, aResist)
    //
    theCircuit.nodes.push(aN0)
    theCircuit.nodes.push(aN1)
    theCircuit.resists.push(aResist)
    //
  } catch (theErr) {
    console.log('Error addResist ', theErr)
  }
}
//
function addLed(theCircuit, theStep0, theStep1) {
  try {
    //
    const aN0 = new Node()
    const aN1 = new Node()
    const aLed = new Led()
    //
    aN0.obj.set(theStep0.i, theStep0.n, theStep0.x, theStep0.y)
    aN1.obj.set(theStep1.i, theStep1.n, theStep1.x, theStep1.y)
    //
    crossLink(aN0, aLed)
    crossLink(aN1, aLed)
    //
    theCircuit.nodes.push(aN0)
    theCircuit.nodes.push(aN1)
    theCircuit.leds.push(aLed)
    //
  } catch (theErr) {
    console.log('Error addLed ', theErr)
  }
}
//
function makeNodes(theCircuit, thePaths) {
  try {
    // How many wires
    const aWireCount = thePaths.length
    if (aWireCount == 0) {
      return
    }
    // How long is a single wire
    const aPathSize = thePaths[0].path.length
    if (aPathSize == 0) {
      return
    }
    // Draw every node
    for (let aWI = 0; aWI < aWireCount; aWI++) {
      const aWire = thePaths[aWI]
      for (let aPI = 0; aPI < aPathSize; aPI++) {
        const aStep = aWire.path[aPI]
        addNode(theCircuit, aStep)
      }
    }
  } catch (theErr) {
    console.log('Error makeNodes ', theErr)
  }
}
//
function makeSources(theCircuit, thePaths) {
  try {
    // How many wires
    const aWireCount = thePaths.length
    if (aWireCount == 0) {
      return
    }
    // How long is a single wire
    const aPathSize = thePaths[0].path.length
    if (aPathSize < 2) {
      return
    }
    // Add Source to every channel
    for (let aWI = 0; aWI < aWireCount; aWI++) {
      const aWire = thePaths[aWI]
      const aStep0 = aWire.path[0]
      const aStep1 = aWire.path[1]
      const aType = aStep0.type
      if (aType == 'V' && (aWI & 1) == 0) {
        continue
      }
      addSource(theCircuit, aStep0, aStep1)
    }
    //
  } catch (theErr) {
    console.log('Error makeSources ', theErr)
  }
}
//
function makeResists(theCircuit, thePaths) {
  try {
    // How many wires
    const aWireCount = thePaths.length
    if (aWireCount == 0) {
      return
    }
    // How long is a single wire
    const aPathSize = thePaths[0].path.length
    if (aPathSize < 4) {
      return
    }
    // Add Resist to every channel
    for (let aWI = 0; aWI < aWireCount; aWI++) {
      const aWire = thePaths[aWI]
      const aStep0 = aWire.path[2]
      const aStep1 = aWire.path[3]
      const aType = aStep0.type
      if (aType == 'V' && (aWI & 1) == 0) {
        continue
      }
      addResist(theCircuit, aStep0, aStep1)
    }
    //
  } catch (theErr) {
    console.log('Error makeResists ', theErr)
  }
}
//
function makePaths(theCircuit, thePaths) {
  try {
    // How many wires
    const aWireCount = thePaths.length
    if (aWireCount == 0) {
      return
    }
    // How long is a single wire
    const aPathSize = thePaths[0].path.length
    if (aPathSize < 2) {
      return
    }
    // How many channels are there
    // some wires share a channel number.
    const aChannelCount = thePaths[aWireCount - 1].path[0].n + 1
    //
    // Draw every wire
    for (let aWI = 0; aWI < aWireCount; aWI++) {
      const aWire = thePaths[aWI]
      for (let aPI = 1; aPI < aPathSize - 1; aPI++) {
        const aStep0 = aWire.path[aPI]
        const aStep1 = aWire.path[aPI + 1]
        addWireSegment(theCircuit, aStep0, aStep1)
      }
    }
  } catch (theErr) {
    console.log('Error makePaths ', theErr)
  }
}
//
function sortTrackY(theA, theB) {
  return theA.y - theB.y
}
//
function makeLeds(theCircuit, thePaths) {
  try {
    // How many wires
    const aWireCount = thePaths.length
    if (aWireCount < 2) {
      return
    }
    // How long is a single wire
    const aPathSize = thePaths[0].path.length
    if (aPathSize < 3) {
      return
    }
    // Scan along the paths looking for crossovers,
    // LEDs will be placed either side of the crossover.
    for (let aPI = 1; aPI < aPathSize - 1; aPI++) {
      const aXSlice = []
      for (let aWI = 0; aWI < aWireCount; aWI++) {
        const aStep = thePaths[aWI].path[aPI]
        aXSlice.push(aStep)
      }
      aXSlice.sort(sortTrackY)
      for (let aWI = 0; aWI < aWireCount - 1; aWI++) {
        const aStep0 = aXSlice[aWI]
        const aStep1 = aXSlice[aWI + 1]
        // If two wires are not the same channel number.
        if (aStep0.n != aStep1.n) {
          // Is there a crossover
          if (aStep0.y == aStep1.y) {
            if (aStep0.dy > 0) {
              const aS0 = thePaths[aStep0.i].path[aStep0.x - 1]
              const aS1 = thePaths[aStep1.i].path[aStep1.x - 1]
              addLed(theCircuit, aS0, aS1)
              const aT0 = thePaths[aStep0.i].path[aStep0.x + 1]
              const aT1 = thePaths[aStep1.i].path[aStep1.x + 1]
              addLed(theCircuit, aT1, aT0)
            }
          }
        }
      }
    }
  } catch (theErr) {
    console.log('Error makeLeds ', theErr)
  }
}
//
//
/**
 * Attempt to build a Circuit3 object.
 * @param {*} theVCount - number of V wires [1,VMAX]
 * @param {*} theECount - number of E Wires [1,EMAX]
 * @returns
 */
export function buildCircuit3(theVCount = 16, theECount = 4) {
  let aCircuit = new Circuit()
  try {
    // Validate input values.
    theVCount = clamp(theVCount, 1, VMAX)
    theECount = clamp(theECount, 1, EMAX)
    //
    // What type of end wiring do we have.
    const aEIsEven = (theECount & 1) == 0
    //
    const aChannelCount = theVCount + theECount * 2
    const aWireCount = theVCount * 2 + theECount * 2
    //
    let aY = aEIsEven ? 1 : 3 // starting Y
    let aDir = aEIsEven ? -1 : 1
    let aChannel = 0 // starting channel
    //
    const aYMin = aY - 1
    //
    const aTracks = []
    //
    // Lower Es
    for (let aEI = 0; aEI < theECount; aEI++) {
      aTracks.push(new Track(aTracks.length, aChannel, aY, aDir, 'E'))
      aDir *= -1 // flip
      //
      aChannel += 1
      aY += 2
    }
    aY += 1
    // middle Vs
    for (let aVI = 0; aVI < theVCount; aVI++) {
      aTracks.push(new Track(aTracks.length, aChannel, aY, aDir, 'V'))
      aDir *= -1 // flip
      aTracks.push(new Track(aTracks.length, aChannel, aY, aDir, 'V'))
      aDir *= -1 // flip
      //
      aChannel += 1
      aY += 4
    }
    aY -= 1
    // Top Es
    for (let aEI = 0; aEI < theECount; aEI++) {
      aTracks.push(new Track(aTracks.length, aChannel, aY, aDir, 'E'))
      aDir *= -1 // flip
      //
      aChannel += 1
      aY += 2
    }
    //
    const aYMax = aY - 1 // + 1
    //
    const aStopCount = theECount * 2 + 3
    //
    // Create a collection of Paths, one for each wire.
    const aPaths = []
    for (let aWI = 0; aWI < aWireCount; aWI++) {
      aPaths.push(new Path())
    }
    //
    // Build the paths.
    // Starting location.
    for (let aWI = 0; aWI < aWireCount; aWI++) {
      aPaths[aWI].save(aTracks[aWI])
    }
    // The Source and Resistor.
    for (let aPreAmble = 0; aPreAmble < 4; aPreAmble++) {
      for (let aWI = 0; aWI < aWireCount; aWI++) {
        aTracks[aWI].advance()
        aPaths[aWI].save(aTracks[aWI])
      }
    }
    // The wiggly wires.
    for (let aGlide = 0; aGlide < aStopCount; aGlide++) {
      for (let aWI = 0; aWI < aWireCount; aWI++) {
        aTracks[aWI].glide(aGlide, aYMin, aYMax)
        aPaths[aWI].save(aTracks[aWI])
      }
    }
    //
    makeNodes(aCircuit, aPaths)
    makeSources(aCircuit, aPaths)
    makeResists(aCircuit, aPaths)
    makePaths(aCircuit, aPaths)
    makeLeds(aCircuit, aPaths)
    //
    aCircuit.calcLimits()
    aCircuit.count = aChannelCount
    //
  } catch (theErr) {
    console.log('Error buildCircuit3 ', theErr)
    aCircuit = new Circuit()
  }
  return aCircuit
}
//
