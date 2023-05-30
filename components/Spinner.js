import React from 'react'
import { BeatLoader, RingLoader } from 'react-spinners'

const Spinner = ({fullWidth}) => {
  if(fullWidth){
    return (
      <div className='w-full flex justify-center'>
        <BeatLoader color='#1E3A8A' speedMultiplier={2} />
      </div>
    )
  }
  return (
    <RingLoader color='#1E3A8A' speedMultiplier={2}/>
  )
}

export default Spinner