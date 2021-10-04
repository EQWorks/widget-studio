
import { createContextStore } from 'easy-peasy'
import model from './model'
import config from './config'

export const StudioStore = createContextStore(model, config)
export const useStoreActions = StudioStore.useStoreActions
export const useStoreState = StudioStore.useStoreState
