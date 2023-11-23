//
import { Obj, Node, Source, Resist, Wire, Led, Circuit, crossLink } from './Parts.js'
//
//
function sortStackItemY(theA, theB) {
  return theA.y - theB.y
}
//
class StackItem {
  //
  constructor(theCount, theI, theN) {
    this.count = theCount // set the range
    this.i = theI //the stack index
    this.n = theN //the channel number
    this.x = 0 //the strting X position
    this.g = theN * 4 + 2 // the starting G position
    const aN1 = theN & 1
    const aDir = aN1 == 0 ? 1 : -1
    this.dir = aDir //the glide direction if active
    this.y = this.g / 4.0 // the starting y position
    this.type = ''
  }
  //
  static copy(theItem) {
    let aReturn = new StackItem(theItem.count, theItem.i, theItem.n)
    aReturn.x = theItem.x
    aReturn.g = theItem.g
    aReturn.y = theItem.y
    aReturn.type = new String(theItem.type)
    return aReturn
  }
  //
  glide(theD, theGlide = false, theType = '') {
    //
    this.x += theD / 4
    //
    if (theGlide == true) {
      if (this.dir != 0) {
        const aCount = this.count
        const aGMax = aCount * 4
        const aGMin = 0
        if (this.dir > 0) {
          this.g += theD
          if (this.g > aGMax) {
            this.g = aGMax - theD
            this.dir = -1
          }
        } else {
          this.g -= theD
          if (this.g < aGMin) {
            this.g = aGMin + theD
            this.dir = 1
          }
        }
        // clip and scale G to create Y.
        let aG = this.g
        aG = Math.min(aG, aGMax - 1)
        aG = Math.max(aG, aGMin + 1)
        this.y = aG / 4.0
      }
    }
    //
    this.type = new String(theType)
    //
  }
  //
}

//
class StackGroup {
  //air
  constructor(theCount) {
    //
    this.stacks = [] //list of previous stacks
    this.stacksSorted = [] //list of previous stack but sorted
    //
    this.stack = [] //current stack
    for (let aI = 0; aI < theCount; aI++) {
      const aStackItem = new StackItem(theCount, 0, aI)
      this.stack.push(aStackItem)
    }
    this.pushStacks()
  }
  //
  makeStackCopy() {
    let aStackCopy = []
    const aCount = this.stack.length
    for (let aI = 0; aI < aCount; aI++) {
      aStackCopy.push(StackItem.copy(this.stack[aI]))
    }
    return aStackCopy
  }
  //
  pushStacks() {
    //
    const aStackCopy1 = this.makeStackCopy()
    this.stacks.push(aStackCopy1)
    //
    const aStackCopy2 = this.makeStackCopy()
    aStackCopy2.sort(sortStackItemY)
    this.stacksSorted.push(aStackCopy2)
    //
  }
  //
  advance(theDX = 2, theGlide = false, theType = '') {
    const aCount = this.stack.length
    const aStack = this.stack
    for (let aI = 0; aI < aCount; aI++) {
      const aSI = aStack[aI]
      aSI.glide(theDX, theGlide, theType)
    }
    this.pushStacks()
  }
  //
}
//
function makeNodes(theCircuit, theStackGroup) {
  try {
    const aPathSize = theStackGroup.stacks.length
    if (aPathSize > 0) {
      const aStack0 = theStackGroup.stacks[0]
      const aChannelCount = aStack0.length
      if (aChannelCount > 0) {
        for (let aCI = 0; aCI < aChannelCount; aCI++) {
          let aNodes = []
          for (let aPI = 0; aPI < aPathSize; aPI++) {
            const aStackPI = theStackGroup.stacks[aPI]
            const aNodePICI = aStackPI[aCI]
            const aNode = new Node()
            aNode.obj.i = aPI
            aNode.obj.n = aCI
            aNode.obj.x = aNodePICI.x
            aNode.obj.y = aNodePICI.y
            aNodes.push(aNode)
          }
          theCircuit.nodes.push(aNodes)
        }
      }
    }
  } catch (theErr) {}
}
//
function findStackIndexContainingType(theStackGroup, theType, theStartIndex = 0) {
  let aReturn = -1
  try {
    const aPathSize = theStackGroup.stacks.length
    if (theStartIndex <= aPathSize - 1) {
      for (let aPI = theStartIndex; aPI < aPathSize; aPI++) {
        const aStack = theStackGroup.stacks[aPI]
        const aItem = aStack[0]
        if (aItem.type == theType) {
          aReturn = aPI
          break
        }
      }
    }
  } catch (theErr) {}
  return aReturn
}
//
function addStackSources(theCircuit, theS0, theS1) {
  try {
    const aCount = theS0.length
    for (let aCI = 0; aCI < aCount; aCI++) {
      //
      const aSN0 = theS0[aCI]
      const aSN1 = theS1[aCI]
      //
      const aN0 = new Node()
      const aN1 = new Node()
      const aSource = new Source()
      //
      aN0.obj.set(aSN0.i, aSN0.n, aSN0.x, aSN0.y)
      aN1.obj.set(aSN1.i, aSN1.n, aSN1.x, aSN1.y)
      //
      crossLink(aN0, aSource)
      crossLink(aN1, aSource)
      //
      theCircuit.nodes.push(aN0)
      theCircuit.nodes.push(aN1)
      theCircuit.sources.push(aSource)
      //
    }
  } catch (theErr) {}
}
//
function addLastStackSources(theCircuit, theStackGroup) {
  try {
    const aCount = theStackGroup.stacks.length
    if (aCount > 1) {
      const aS0 = theStackGroup.stacks[aCount - 2]
      const aS1 = theStackGroup.stacks[aCount - 1]
      addStackSources(theCircuit, aS0, aS1)
    }
  } catch (theErr) {}
}
//
function addStackResists(theCircuit, theS0, theS1) {
  try {
    const aCount = theS0.length
    for (let aCI = 0; aCI < aCount; aCI++) {
      //
      const aSN0 = theS0[aCI]
      const aSN1 = theS1[aCI]
      //
      const aN0 = new Node()
      const aN1 = new Node()
      const aResist = new Source()
      //
      aN0.obj.set(aSN0.i, aSN0.n, aSN0.x, aSN0.y)
      aN1.obj.set(aSN1.i, aSN1.n, aSN1.x, aSN1.y)
      //
      crossLink(aN0, aResist)
      crossLink(aN1, aResist)
      //
      //
      theCircuit.nodes.push(aN0)
      theCircuit.nodes.push(aN1)
      theCircuit.resists.push(aResist)
      //
    }
  } catch (theErr) {}
}
//
function addLastStackResists(theCircuit, theStackGroup) {
  try {
    const aCount = theStackGroup.stacks.length
    if (aCount > 1) {
      const aS0 = theStackGroup.stacks[aCount - 2]
      const aS1 = theStackGroup.stacks[aCount - 1]
      addStackResists(theCircuit, aS0, aS1)
    }
  } catch (theErr) {}
}
//
function addStackLed(theCircuit, theSN0, theSN1) {
  try {
    //
    const aN0 = new Node()
    const aN1 = new Node()
    const aLed = new Led()
    //
    aN0.obj.set(theSN0.i, theSN0.n, theSN0.x, theSN0.y)
    aN1.obj.set(theSN1.i, theSN1.n, theSN1.x, theSN1.y)
    //
    crossLink(aN0, aLed)
    crossLink(aN1, aLed)
    //
    theCircuit.nodes.push(aN0)
    theCircuit.nodes.push(aN1)
    theCircuit.leds.push(aLed)
    //
  } catch (theErr) {}
}
//
function addStackLeds(theCircuit, theStack) {
  try {
    const aSize = theStack.length
    if (aSize > 1) {
      for (let aSI = 0; aSI < aSize - 1; aSI++) {
        const aSI0 = theStack[aSI]
        const aSI1 = theStack[aSI + 1]
        const aSpan = aSI1.y - aSI0.y
        if (aSpan < 1) {
          addStackLed(theCircuit, aSI0, aSI1)
          aSI++
        }
      }
    }
  } catch (theErr) {}
}
//
function addLastStackLeds(theCircuit, theStackGroup) {
  try {
    const aCount = theStackGroup.stacksSorted.length
    if (aCount > 0) {
      const aLastStack = theStackGroup.stacksSorted[aCount - 1]
      addStackLeds(theCircuit, aLastStack)
    }
  } catch (theErr) {}
}
//
function addStackWire(theCircuit, theSN0, theSN1) {
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
  } catch (theErr) {}
}
//
function makePaths(theCircuit, theStackGroup) {
  try {
    const aPathSize = theStackGroup.stacks.length
    if (aPathSize > 1) {
      const aStack = theStackGroup.stacks[0]
      const aChanCount = aStack.length
      if (aChanCount > 0) {
        for (let aCI = 0; aCI < aChanCount; aCI++) {
          for (let aPI = 1; aPI < aPathSize - 1; aPI++) {
            const aStack0 = theStackGroup.stacks[aPI]
            const aStack1 = theStackGroup.stacks[aPI + 1]
            const aSN0 = aStack0[aCI]
            const aSN1 = aStack1[aCI]
            addStackWire(theCircuit, aSN0, aSN1)
          }
        }
      }
    }
  } catch (theErr) {}
}
//
export function buildCircuit1b(theCount = 16) {
  let aCircuit = new Circuit()
  try {
    //
    if (theCount < 2 || theCount > 128) {
      throw new Error(`bad value theCount = ${theCount}`)
    }
    //
    const aExpectedLedCount = (theCount / 2) * (theCount - 1) * 2
    //
    aCircuit.count = theCount
    //
    const aStackGroup = new StackGroup(theCount)
    aStackGroup.advance(2, false, 'source')
    addLastStackSources(aCircuit, aStackGroup)
    aStackGroup.advance(2)
    aStackGroup.advance(2, false, 'resist')
    addLastStackResists(aCircuit, aStackGroup)
    aStackGroup.advance(2)
    do {
      aStackGroup.advance(1, true, 'led')
      addLastStackLeds(aCircuit, aStackGroup)
      aStackGroup.advance(1, true)
    } while (aCircuit.leds.length < aExpectedLedCount)
    //
    makeNodes(aCircuit, aStackGroup)
    makePaths(aCircuit, aStackGroup)
    //
    aCircuit.calcLimits()
    //
  } catch (theErr) {
    console.log('Error buildCircuit1b ', theErr)
    aCircuit = new Circuit()
  }
  return aCircuit
}
//
