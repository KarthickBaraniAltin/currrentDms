import Image from 'next/image'
import React from 'react'

export default function ViewHeader() {
  return (
    <div className='flex flex-column'>
        <div>
            <div style={{'color': 'black', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0 2rem'}}> {/* 'background': '#004990', 'marginBottom': '0.5rem', padding: '1rem', borderRadius: '1rem'  */}
                {headerImage[componentData.name]?.url ? 
                <Image alt="viewHeader" src={headerImage[componentData.name].url} style={{alignSelf: 'center'}} width='100' height='100' /> 
                : 
                <div style={{width: '100px', height: '100px'}}></div>
                }
                <h1 style={{alignSelf: 'center', textAlign: 'center'}}>{label}</h1>
                <div style={{width: '100px', height: '100px'}}></div>
            </div>
        </div>
    </div>
  )
}
