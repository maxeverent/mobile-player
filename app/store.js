import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { Http } from '@nativescript/core'

export default new Vuex.Store({
    state: {
        playlistTracks: []
    },
    mutations: {
        getTracks(state, res) {
            state.playlistTracks = res
        },
        addTrack(state, trackId) {
            state.playlistTracks.push(trackId)
        },
        deleteTrack(state, index) {
            state.playlistTracks.splice(index, 1)
        }
    },
    actions: {
        async getTracks(ctx, playlistId) {
            await Http.getJSON('https://rust-square-cotton.glitch.me/playlist/get/' + playlistId).then(
                (result) => {
                    const res = result
                    //console.log(res)
                    ctx.commit('getTracks', res)
                },
            )
        },
        addTrack(ctx, trackId) {
            ctx.commit('addTrack', trackId)
        },
        deleteTrack(ctx, index) {
            ctx.commit('deleteTrack', index)
        }
    },
    getters: {
        getTracks(state) {
            console.log(state)
            return state.playlistTracks
        }
    },
})