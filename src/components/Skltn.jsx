import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Skltn() {
  return (
    <div>
        <Skeleton count={5}/>
    </div>
  )
}
