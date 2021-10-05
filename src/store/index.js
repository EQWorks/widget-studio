
import { createContextStore } from 'easy-peasy'
import model from './model'
import config from './config'


export const EditorStore = createContextStore(model, config)
export const useStoreActions = EditorStore.useStoreActions
export const useStoreState = EditorStore.useStoreState
