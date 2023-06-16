import { arrayMove } from "@dnd-kit/sortable"
import { Guid } from 'js-guid'

const useDnd = () => {

    const addMainForm = (active, metadata, addMetadata) => {
        // children property will not be used in metadata with destructuring we are deleting it
        // otherwise we will get a cyclic object error
        const { children, ...updatedData } = active.data.current
        const guid = Guid.newGuid().StringGuid

        updatedData.guid = guid
        updatedData.name = `${updatedData.name}_${Object.keys(metadata).length + 1}`

        addMetadata(updatedData)
    }

    const sortMainForm = (active, over, setMainFormIds, setMetadata) => {
        setMainFormIds(ids => {
            const activeIndex = ids.indexOf(active.id)
            const overIndex = ids.indexOf(over.id)

            return arrayMove(ids, activeIndex, overIndex)
        })

        setMetadata(prevState => {
            const dragItemId = Object.keys(prevState).indexOf(active.id)
            const hoverItemId = Object.keys(prevState).indexOf(over.id)
            const metadataEntries = Object.entries(prevState)
            const dragItem = metadataEntries[dragItemId]
            
            metadataEntries.splice(dragItemId, 1)
            metadataEntries.splice(hoverItemId, 0, dragItem)

            const updatedMetadata = Object.fromEntries(metadataEntries)

            return updatedMetadata
        })
    }

    const handleDragEnd = (event, metadata, addMetadata, setMetadata, setMainFormIds) => {
        const { active, over } = event

        if (over !== null && !active.data.current.sortable) {
            addMainForm(active, metadata, addMetadata)
        }

        if (active.data.current.sortable) {
            if (active.id !== over?.id) {
                sortMainForm(active, over, setMainFormIds, setMetadata)
            }
        }
    }

    return { handleDragEnd }
}

export default useDnd