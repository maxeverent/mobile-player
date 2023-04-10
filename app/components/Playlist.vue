<template>
    <StackLayout class="playlist-background">
        <StackLayout orientation="horizontal" class="playlist-btns">
            <StackLayout @tap="switchToogle()" class="playlist-name">
                <Label class="name">{{ playlist.name }}</Label>
            </StackLayout>
            <Button @tap="deletePlaylist()" class="btn"/>
        </StackLayout>
        <StackLayout v-if="toogle" class="playlist-tracks">
            <StackLayout v-if="!playlistDeleted">
                <StackLayout v-if="tracks.length != 0" class="tracks">
                    <PlaylistTrack 
                        v-for="track, index in tracks" 
                        :track="track" 
                        :key="index" 
                        :index="index" 
                        :playlist=playlist 
                        @playPlaylistTrack="playPlaylistTrack"
                        @removeTrack="removeTrack"
                        class="track"/>
                </StackLayout>
                <StackLayout v-else class="playlist-tracks">
                    <Label class="empty">Нет добавленных треков</Label>
                </StackLayout>
            </StackLayout>
        </StackLayout>
    </StackLayout>
</template>

<script>

import { Http } from '@nativescript/core'

import PlaylistTrack from './PlaylistTrack.vue'

export default {
    data() {
        return {
            playlistDeleted: false,
            toogle: false,
            tracks: [],
            playlistTracks: [],
        }
    },
    components: {
        PlaylistTrack,
    },
    props: {
        playlist: Object,
        allMusic: Array,
    },
    methods: {
        async getTracks() {
            await this.$store.dispatch('getTracks', this.playlist.id)
            console.log(this.$store.state.playlistTracks)
            this.playlistTracks = this.$store.state.playlistTracks
            this.tracks = []
            for (let i = 0; i < this.playlistTracks.length; i++) {
                for (let j = 0; j < this.allMusic.length; j++) {
                    if (this.playlistTracks[i] == this.allMusic[j].id) {
                        let track = {
                            id: this.allMusic[j].id,
                            name: this.allMusic[j].name,
                            artist: this.allMusic[j].artist
                        }
                        this.tracks.push(track)
                    }
                }
            }
        },
        // async getTracks() {
        //     await Http.getJSON('https://rust-square-cotton.glitch.me/playlist/get/' + this.playlist.id).then(
        //     (result) => {
        //         let response = result
        //         this.playlistTracks = result
        //         this.tracks = []
        //         for (let i = 0; i < response.length; i++) {
        //             for (let j = 0; j < this.allMusic.length; j++) {
        //                 if (response[i] == this.allMusic[j].id) {
        //                     let track = {
        //                         id: this.allMusic[j].id,
        //                         name: this.allMusic[j].name,
        //                         artist: this.allMusic[j].artist
        //                     }
        //                     this.tracks.push(track)
        //                 }
        //             }
        //         }
        //     },
        //     e => {}
        //     )
        // },
        async getAllMusic() {
            await Http.getJSON('https://rust-square-cotton.glitch.me/music/get').then(
            (result) => {
                console.log(result)
                this.allMusic = result
            },
            e => {}
            )
        },
        switchToogle() {
            this.getTracks()
            this.toogle = !this.toogle
        },
        playPlaylistTrack(trackId) {
            this.$emit('playPlaylistTrack', {tracks: this.playlistTracks, currentTrack: trackId})
            console.log(this.playlistTracks, trackId)
        },
        removeTrack(data) {
            this.tracks.splice(data.index, 1)
            for (let i = 0; i < this.playlistTracks.length; i++) {
                if (this.playlistTracks[i] == data.trackId) {
                    this.playlistTracks.splice(i, 1)
                }
            }
        },
        async deletePlaylist() {
            await Http.request({
                url: 'https://rust-square-cotton.glitch.me/playlists/delete/' + this.playlist.id,
                method: 'DELETE',
                headers: { 
                    "Content-Type": "application/json; charset=utf-8",
                    "Connection": "keep-alive",
                    "access-control-allow-origin": "*"
                }
            }).then(
            (res) => {
               console.log(res)
            },
            e => {}
            )
            this.$emit('removePlaylist')
            this.playlistDeleted = true
        }
    },
    created() {
        this.getTracks()
    },
}

</script>