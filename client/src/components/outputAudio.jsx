import React, { useEffect, useRef } from 'react'

const OutPutAudio =  ({partner})=>{
  console.log(partner)
  const audioRef = useRef(null)
  useEffect(()=>{
    partner.myHisPeer.on('stream', (stream)=>{
      audioRef.current.srcObject = stream
    })
  })
  return (
    <audio ref={audioRef} controls></audio>
  )
}

export default OutPutAudio