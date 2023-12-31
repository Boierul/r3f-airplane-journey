/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 public\models\planeur\model.glb
*/

import React from 'react'
import {useGLTF} from '@react-three/drei'

export function Airplane(props) {
    const { nodes, materials } = useGLTF('./models/planeur/model.glb')
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes.Cylinder.geometry} material={nodes.Cylinder.material} />
        </group>
    )
}

useGLTF.preload('./models/planeur/model.glb')

