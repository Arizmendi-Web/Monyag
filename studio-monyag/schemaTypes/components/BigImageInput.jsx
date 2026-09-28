import React from 'react'
import { Card } from '@sanity/ui'

export function BigImageInput(props) {
  const hasValue = Boolean(props.value?.asset)

  return (
    <Card
      tone="default"
      padding={hasValue ? 0 : 4}
      style={{
        border: hasValue ? 'none' : '2px dashed var(--card-border-color, #ccd0d8)',
        borderRadius: '6px',
        minHeight: hasValue ? 'auto' : '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%' }}>
        {props.renderDefault(props)}
      </div>
    </Card>
  )
}