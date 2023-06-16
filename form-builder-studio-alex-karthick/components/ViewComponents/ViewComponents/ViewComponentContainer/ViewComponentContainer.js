import React from 'react'

export default function ViewComponentsContainer({children, ...props}) {
  return (
    <>
        <div {...props}>
          {children}
        </div>
    </>
  )
}
