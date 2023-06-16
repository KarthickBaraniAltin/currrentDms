import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import clsx from "clsx"
import DragButton from "../DragButton/DragButton"

import styles from '../Sortable/Sortable.module.css'

export function Sortable({ id, children, className }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: 'white',
        border: '2px',
        borderRadius: '10px',
        paddingTop: '0.2rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingBottom: '0.2rem',
        boxShadow: '0 0 3px 1px rgba(0, 0, 0, 0.2)',
        position: 'relative'
    }
    
    return (
        <>
            <div className={`${styles.hoverContainer}`} ref={setNodeRef} style={style} {...attributes}>
                <DragButton listeners={listeners}/>
                {children}
            </div>
        </>
    )
}