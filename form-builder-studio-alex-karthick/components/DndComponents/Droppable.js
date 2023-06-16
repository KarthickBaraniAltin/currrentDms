import React from 'react'
import { useDroppable } from '@dnd-kit/core'

export function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })
  const style = {
    backgroundColor: isOver ? '#004990' : undefined,
  }

  return (
    <div className="grid grid-nogutter" ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}