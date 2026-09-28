import {Stack, Flex, Button} from '@sanity/ui'
import {useFormCallbacks} from 'sanity'

export function DoneButtonInput(props) {
  const {onPathOpen} = useFormCallbacks()
  // Opening the parent array path collapses this item's dialog
  const parentPath = props.path.slice(0, -1)

  return (
    <Stack space={5}>
      {props.renderDefault(props)}
      <Flex justify="flex-end">
        <Button
          text="Save & Close"
          tone="positive"
          onClick={() => onPathOpen(parentPath)}
        />
      </Flex>
    </Stack>
  )
}