import React, {useCallback, useRef, useState} from 'react'
import {Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {set, useClient} from 'sanity'

export function BigImageInput(props) {
  const {value, onChange, readOnly} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const hasValue = Boolean(value?.asset)

  const uploadFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        setError('Please choose an image file.')
        return
      }
      setError(null)
      setIsUploading(true)
      try {
        const asset = await client.assets.upload('image', file, {filename: file.name})
        onChange(
          set({
            _type: 'image',
            asset: {_type: 'reference', _ref: asset._id},
          }),
        )
      } catch (err) {
        console.error(err)
        setError('Upload failed. Please try again.')
      } finally {
        setIsUploading(false)
      }
    },
    [client, onChange],
  )

  // Once an image exists, use Sanity's normal input (preview, crop, hotspot, menu)
  if (hasValue) {
    return props.renderDefault(props)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (readOnly) return
    uploadFile(e.dataTransfer.files?.[0])
  }

  const handlePaste = (e) => {
    if (readOnly) return
    const file = Array.from(e.clipboardData?.files || [])[0]
    if (file) {
      e.preventDefault()
      uploadFile(file)
    }
  }

  return (
    <Stack space={3}>
      <Card
        tabIndex={0}
        role="button"
        aria-label="Drop, paste, or click to upload an image"
        onClick={() => !readOnly && !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !readOnly) fileInputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!readOnly) setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tone={isDragging ? 'primary' : 'default'}
        style={{
          minHeight: '380px', // adjust to taste
          border: `2px dashed ${
            isDragging ? 'var(--card-focus-ring-color, #2276fc)' : 'var(--card-border-color, #ccd0d8)'
          }`,
          borderRadius: '6px',
          cursor: readOnly ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Flex direction="column" align="center" justify="center" gap={3} padding={4}>
          {isUploading ? (
            <>
              <Spinner muted />
              <Text muted size={1}>Uploading...</Text>
            </>
          ) : (
            <>
              <Text size={4}>🖼️</Text>
              <Text weight="semibold" size={2}>
                {isDragging ? 'Drop image to upload' : 'Drag, paste, or click to add an image'}
              </Text>
              <Text muted size={1}>JPG, PNG, or WebP</Text>
            </>
          )}
        </Flex>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={(e) => {
            uploadFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </Card>

      {error && (
        <Text size={1} style={{color: 'var(--card-badge-critical-dot-color, #e03a3e)'}}>
          {error}
        </Text>
      )}
    </Stack>
  )
}