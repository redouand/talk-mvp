import React, { useEffect, useRef } from 'react'

const OutPutAudio =  ({partner})=>{
  const audioRef = useRef(null)
  useEffect(()=>{
    partner.myHisPeer.on('stream', (stream)=>{
      console.log('the received stream==>', stream)
      audioRef.current.srcObject = stream
    })
  })
  return (
    <audio ref={audioRef} autoPlay controls></audio>
  )
}

export default OutPutAudio