import React from 'react'
import Image from 'next/image'
import logo from '../images/csn-logo.png'

export default function Logo() {
  return (
    <Image src={logo} alt="CSN Logo" width='213' height='61' />  
  )
}
