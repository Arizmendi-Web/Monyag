import React from 'react'
import { Card } from '@sanity/ui'

export function BigImageInput(props) {
  const hasValue = Boolean(props.value?.asset)

  return (
    <Card
      style={{
        // Targets the inner drop zone container directly
        '& [data-ui="DropTarget"]': {
          minHeight: hasValue ? 'auto' : '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        // Fallback targeting for Sanity's internal file input wrapper frame
        '& button[data-testid="file-button"]': {
          minHeight: hasValue ? 'auto' : '260px',
        },
      }}
    >
      <div
        style={{
          // Direct inline target for the drop zone box element
          minHeight: hasValue ? 'auto' : '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {props.renderDefault(props)}
      </div>
    </Card>
  )
}