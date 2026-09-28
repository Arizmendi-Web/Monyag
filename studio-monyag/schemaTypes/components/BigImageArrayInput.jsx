import React, {useCallback, useRef, useState} from 'react'
import {Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {insert, setIfMissing, useClient} from 'sanity'

const makeKey = () => Math.random().toString(36).slice(2, 14)

export function BigImageArrayInput(props) {
  const {value, onChange, readOnly} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState({done: 0, total: 0})
  const [error, setError] = useState(null)

  const hasItems = Array.isArray(value) && value.length > 0

  const uploadFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'))
      if (files.length === 0) {
        setError('Please choose image files.')
        return
      }

      setError(null)
      setIsUploading(true)
      setProgress({done: 0, total: files.length})

      const items = []
      let failed = 0

      for (const file of files) {
        try {
          const asset = await client.assets.upload('image', file, {filename: file.name})
          items.push({
            _key: makeKey(),
            _type: 'image',
            asset: {_type: 'reference', _ref: asset._id},
          })
        } catch (err) {
          console.error(err)
          failed += 1
        }
        setProgress((p) => ({...p, done: p.done + 1}))
      }

      if (items.length > 0) {
        // Add every successful upload in a single change
        onChange([setIfMissing([]), insert(items, 'after', [-1])])
      }
      if (failed > 0) {
        setError(`${failed} photo(s) failed to upload. Please try again.`)
      }
      setIsUploading(false)
    },
    [client, onChange],
  )

  // Once photos exist, use Sanity's normal grid (reorder, remove, hotspot, add more)
  if (hasItems) {
    return props.renderDefault(props)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (readOnly || isUploading) return
    uploadFiles(e.dataTransfer.files)
  }

  const handlePaste = (e) => {
    if (readOnly || isUploading) return
    const files = Array.from(e.clipboardData?.files || [])
    if (files.length > 0) {
      e.preventDefault()
      uploadFiles(files)
    }
  }

  return (
    <Stack space={3}>
      <Card
        tabIndex={0}
        role="button"
        aria-label="Drop, paste, or click to upload photos"
        onClick={() => !readOnly && !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !readOnly && !isUploading) {
            fileInputRef.current?.click()
          }
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
          minHeight: '380px',
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
              <Text muted size={1}>
                Uploading {Math.min(progress.done + 1, progress.total)} of {progress.total}...
              </Text>
            </>
          ) : (
            <>
              <Text size={4}>🖼️</Text>
              <Text weight="semibold" size={2}>
                {isDragging ? 'Drop photos to upload' : 'Drag, paste, or click to add photos'}
              </Text>
              <Text muted size={1}>You can add several photos at once</Text>
            </>
          )}
        </Flex>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{display: 'none'}}
          onChange={(e) => {
            uploadFiles(e.target.files)
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