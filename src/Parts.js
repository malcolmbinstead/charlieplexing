//
let global_Id_Seed = 1
//
export function clearIdSeed() {
  global_Id_Seed = 1
}
//
export function crossLink(a, b) {
  try {
    a.links.push(b)
    b.links.push(a)
  } catch (theErr) {
    console.log(`Error: crossLink ${a} ${b} ${theErr}`)
  }
}
//
export class Obj {
  //
  constructor(theI = 0, theN = 0, theX = 0, theY = 0) {
    this.i = theI // index for routes
    this.n = theN // channel
    this.x = theX // x pos
    this.y = theY // y pos
  }
  //
  set(theI = 0, theN = 0, theX = 0, theY = 0) {
    this.i = theI // index for routes
    this.n = theN // channel
    this.x = theX // x pos
    this.y = theY // y pos
  }
  //
}
//
export class Base {
  //
  constructor() {
    //
    this.id = global_Id_Seed
    global_Id_Seed++
    //
    this.links = []
    this.type = 'base'
    this.obj = new Obj() // = null
    //
    this.states = []
    this.stateNo = 0
    //
  }
  //
}
//
/**
 * A node represents a point within the circuit.
 * it has a physical position
 * a working voltage
 * and a collection of arcs it is linked to.
 */
export class Node extends Base {
  //
  constructor() {
    super()
    this.type = 'node'
    //
    this.v = 0 //voltage
  }
}
//
/**
 * An arc is an object that links up to two nodes.
 * it is pysically constrained by the nodes it is attached to.
 * it has a working current that is derived from the voltages at its ends.
 */
export class Arc extends Base {
  //
  constructor() {
    super()
    this.type = 'arc'
    this.r = 0 // internal resistance
    this.v = 0 // driven voltage
    this.i = 0 // current through arc.
    this.t = 0 // threshold.
  }
  //
}
//
export class Source extends Arc {
  //
  constructor() {
    super()
    this.type = 'source'
    //
    this.states = ['Z', '0', '1']
    //
    this.r = 0
    this.v = 10
    //
  }
  //
}
//
export class Resist extends Arc {
  //
  constructor() {
    super()
    this.type = 'resist'
    //
    this.r = 1000
    //
  }
  //
}
//
export class Wire extends Arc {
  //
  constructor() {
    super()
    this.type = 'wire'
    //
    this.r = 1
    //
  }
  //
}
//
export class Led extends Arc {
  //
  constructor() {
    super()
    this.type = 'led'
    //
    this.states = ['0', '1']
    //
    this.r = 1
    this.t = 1
    //
  }
  //
}
//
//
export class Circuit {
  //
  constructor() {
    //
    clearIdSeed() // Id generator for base.
    //
    this.count = 0 // number of wire routes.
    //
    this.nodes = [] // list of lists, or list of nodes.
    this.xnodes = [] // additional nodes for clarity.
    this.sources = [] // list of links that drive the circuit.
    this.wires = [] // list of links that connect the circuit.
    this.resists = [] // list of links that loosely connect the circuit.
    this.leds = [] // list of links that contain a LED.
    //
    // physical limits
    this.xmin = 0
    this.xmax = 0
    this.ymin = 0
    this.ymax = 0
    //
  }
  //
  calcLimits() {
    //
    try {
      // flatten list of lists.
      const aNodes = []
      //
      const aListCount = this.nodes.length
      for (let aL = 0; aL < aListCount; aL++) {
        const aT = this.nodes[aL]
        if (aT instanceof Array) {
          // list of lists
          const aList = this.nodes[aL]
          const aNodeCount = aList.length
          for (let aI = 0; aI < aNodeCount; aI++) {
            const aNode = aList[aI]
            aNodes.push(aNode)
          }
        } else {
          // list of nodes
          const aNode = this.nodes[aL]
          aNodes.push(aNode)
        }
      }
      //overwrite initial node lists.
      this.nodes = aNodes
      //
      const aNodesCount = aNodes.length
      for (let aNI = 0; aNI < aNodesCount; aNI++) {
        const aNode = aNodes[aNI]
        const aX = aNode.obj.x
        const aY = aNode.obj.y
        if (aNI == 0) {
          this.xmin = this.xmax = aX
          this.ymin = this.ymax = aY
        } else {
          this.xmin = Math.min(this.xmin, aX)
          this.ymin = Math.min(this.ymin, aY)
          this.xmax = Math.max(this.xmax, aX)
          this.ymax = Math.max(this.ymax, aY)
        }
      }
      //
    } catch (theErr) {
      console.log('Error: calcLimits. ', theErr)
    }
  }
  //
}
//
