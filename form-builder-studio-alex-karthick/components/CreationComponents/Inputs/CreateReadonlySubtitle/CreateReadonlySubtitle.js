import React from 'react'
import ReadonlyLexicalEditor from '../../../LexicalEditor/ReadonlyLexicalEditor/ReadonlyLexicalEditor'
import SettingsButton from '../../SettingsButton/SettingsButton'

export default function CreateReadonlySubtitle({ metadata, openDialog, setMetadata }) {
    const { subtitle } = metadata

    return (
        <div>
            <SettingsButton componentData={metadata} openDialog={openDialog} setMetadata={setMetadata} />
            <ReadonlyLexicalEditor value={subtitle} />
        </div>
    )
}
