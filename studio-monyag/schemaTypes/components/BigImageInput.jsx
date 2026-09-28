import React from 'react'
import { Card } from '@sanity/ui'

export function BigImageInput(props) {
  const hasValue = Boolean(props.value?.asset)

  return (
    <Card
      style={{
        // Force the wrapper container to have a minimum height when empty
        minHeight: hasValue ? 'auto' : '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Render Sanity's standard image upload input inside */}
      {props.renderDefault(props)}
    </Card>
  )
}