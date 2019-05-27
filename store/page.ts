/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { Page, blankPage } from '~/common/page'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface PageState {
  id: string
  name: string
  image: string
  content: string
  isDraft: boolean
}

export const state = () => ({
  id: '',
  name: '',
  image: '',
  content: '',
  isDraft: true
})

export const actions: ActionTree<PageState, RootState> = {
  resetPage({ commit }) {
    commit('setPage', blankPage)
  },

  setPage({ commit }, page: Page) {
    commit('setPage', page)
  },

  setName({ commit }, name: string) {
    commit('setName', name)
  },

  setContent({ commit }, content: string) {
    commit('setContent', content)
  },

  setImage({ commit }, image: string) {
    commit('setImage', image)
  },

  setIsDraft({ commit }, isDraft: boolean) {
    commit('setIsDraft', isDraft)
  }
}

export const mutations: MutationTree<PageState> = {
  setPage(state, page: Page) {
    state.id = page.id
    state.name = page.data.name
    state.image = page.data.image
    state.content = page.data.content
    state.isDraft = page.data.isDraft
  },

  setName(state, name: string) {
    state.name = name
  },

  setContent(state, content: string) {
    state.content = content
  },

  setImage(state, image: string) {
    state.image = image
  },

  setIsDraft(state, isDraft: boolean) {
    state.isDraft = isDraft
  }
}

export const getters: GetterTree<PageState, RootState> = {}
