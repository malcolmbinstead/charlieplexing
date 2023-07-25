//
import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { getWhite,channelColor } from './utils.js'

//
export default function Rnode({ circuit, node }) {
  //
  console.log('Rnode. ')
  //
  const aNX = node.obj.x
  const aNY = node.obj.y
  const aNN = node.obj.n
  const aCount = circuit.count
  const aColor = channelColor(aNN,aCount)
  //
  return (
    <>
      <group position={[aNX, aNY, 0]}>
        <mesh>
          <circleGeometry args={[0.05]} />
          <meshBasicMaterial color={aColor} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  )
  //
}
//
