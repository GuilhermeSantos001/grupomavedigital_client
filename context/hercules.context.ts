/**
 * @description Context -> Hercules Storage
 * @author GuilhermeSantos001
 * @update 09/12/2021
 */

import React from 'react';

export interface IItemAction {
    name: string
    action: Action
}

export type Action = 'None' | 'Rename' | 'Delete'

export interface IFolderItemsAvailableForSelect {
    cid: string
    name: string
    type?: string
    whichIs: 'folder' | 'file'
}

export interface IHerculesContext {
    searchFolderByName: (name: string) => boolean
    searchFileByName: (name: string) => boolean
    addFolderItemAction: (item: IItemAction) => void
    removeFolderItemAction: (name: string) => void
    addFileItemAction: (item: IItemAction) => void
    removeFileItemAction: (name: string) => void
    getFolderItemAction: (name: string) => IItemAction
    countFolderItemAction: () => number
    getFileItemAction: (name: string) => IItemAction
    countFileItemAction: () => number
    defineSelectedAllFolderItensAction(selected: boolean): void
    hasSelectedAllFolderItensAction: () => boolean
    defineSelectedAllFileItensAction(selected: boolean): void
    hasSelectedAllFileItensAction: () => boolean
    getFolderItemsAvailableForSelect: (exclude: string[]) => IFolderItemsAvailableForSelect[]
    moveItemForFolder: (id: string, parentId: string) => void
    removeItemOfFolder: (id: string, type: 'folder' | 'file', room: string[]) => Promise<void>
    hasItemFolderId: (id: string) => boolean
}

const HerculesContext = React.createContext<IHerculesContext>({
    searchFolderByName: () => { throw new Error('Method is not implemented') },
    searchFileByName: () => { throw new Error('Method is not implemented') },
    addFolderItemAction: () => { throw new Error('Method is not implemented') },
    removeFolderItemAction: () => { throw new Error('Method is not implemented') },
    addFileItemAction: () => { throw new Error('Method is not implemented') },
    removeFileItemAction: () => { throw new Error('Method is not implemented') },
    getFolderItemAction: () => { throw new Error('Method is not implemented') },
    countFolderItemAction: () => { throw new Error('Method is not implemented') },
    getFileItemAction: () => { throw new Error('Method is not implemented') },
    countFileItemAction: () => { throw new Error('Method is not implemented') },
    defineSelectedAllFolderItensAction: () => { throw new Error('Method is not implemented') },
    hasSelectedAllFolderItensAction: () => { throw new Error('Method is not implemented') },
    defineSelectedAllFileItensAction: () => { throw new Error('Method is not implemented') },
    hasSelectedAllFileItensAction: () => { throw new Error('Method is not implemented') },
    getFolderItemsAvailableForSelect: () => { throw new Error('Method is not implemented') },
    moveItemForFolder: () => { throw new Error('Method is not implemented') },
    removeItemOfFolder: () => { throw new Error('Method is not implemented') },
    hasItemFolderId: () => { throw new Error('Method is not implemented') },
});

export default HerculesContext;