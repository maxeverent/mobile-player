<template>
    <Page xmlns="http://www.nativescript.org/tns.xsd">
        <ActionBar>
            <Label text="Music" class="title"/>
        </ActionBar>
        <StackLayout class="home-background">
            <StackLayout class="nav" orientation="horizontal">
                <StackLayout class="nav-btn" @tap="goToMusic()">
                    <Label style="text-align: center;">Tracks</Label>
                </StackLayout>
                <StackLayout class="nav-btn" @tap="goToPlaylists()">
                    <Label style="text-align: center">Playlists</Label>
                </StackLayout>
            </StackLayout>
            <StackLayout v-if="toogle" class="tracks">
                <TextField v-model="searchText" hint="Enter text..." class="search"/>
                <ScrollView orientation="vertical" style="height: 1600px;">
                    <StackLayout>
                        <Track 
                            v-for="track, index in filteredItems" 
                            :track="track" 
                            :key="index" 
                            :index="index + 1" 
                            @playTrack="playTrack"
                            @addTrack="addTrack"
                            class="track"/> 
                    </StackLayout>
                </ScrollView>        
            </StackLayout>
            <StackLayout v-else class="playlists">
                <StackLayout orientation="horizontal" class="create-playlist">
                    <StackLayout>
                        <TextField v-model="playlistName" hint="Название плейлиста" class="search"/>
                        <Label v-if="error != ''" class="error">{{ error }}</Label>
                    </StackLayout>
                    <StackLayout @tap="createPlaylist()" class="create">
                        <Label style="text-align: center">Create</Label>
                    </StackLayout>
                </StackLayout>
                <ScrollView orientation="vertical" style="height: 1600px;">
                    <StackLayout>
                        <Playlist 
                            v-for="playlist, index in playlists" 
                            :playlist="playlist" 
                            :key="index" 
                            :allMusic="allMusic" 
                            @playPlaylistTrack="playPlaylistTrack"
                            @removePlaylist="removePlaylist"
                            class="playlist"/>
                    </StackLayout>
                </ScrollView>
            </StackLayout>
            <Player 
                :music="allMusic" 
                :status="status" 
                :index="index" 
                :playlistTracks="playlistTracks" 
                :currentPlaylistTrack="currentPlaylistTrack" 
                ref="child"
                class="music-player"/>
        </StackLayout>
    </Page>
</template>

<script>

import { Http } from '@nativescript/core'

import Playlist from './Playlist.vue'
import Track from './Track.vue'
import Player from './Player.vue'
import Modal from './Modal.vue'

//const modalViewModule = PopUp

export default {
    data() {
        return {
            playlistName: '',
            searchText: '',
            status: '',
            toogle: true,
            music: [],
            allMusic: [],
            playlists: [],
            playlistTracks: [],
            currentPlaylistTrack: '',
            index: 1,
            error: '',
        }
    },
    components: {
        Track,
        Player,
        Playlist
    },
    methods:
    {
        playPlaylistTrack(data) {
            this.playlistTracks = data.tracks
            this.currentPlaylistTrack = data.currentTrack
            this.status = 'Playlist'
            setTimeout(() => { this.$refs.child.play() }, 500)
            console.log(data)
        },
        playTrack(number) {
            this.index = number
            this.status = 'allMusic'
            setTimeout(() => { this.$refs.child.play() }, 500)
            console.log(number)
        },
        async play()
        {
            await this.player.playFromUrl(this.playerOptions)        
            .then(res => 
            {
                console.log(res);
            })
            .catch(err => {
            console.log('something went wrong...', err);
            })
        
        },
        async getAllMusic() {
            await Http.getJSON('https://rust-square-cotton.glitch.me/music/get').then(
            (result) => {
                console.log(result)
                this.allMusic = result
            },
            e => {}
            )
        },
        async getPlaylists() {
            await Http.getJSON('https://rust-square-cotton.glitch.me/playlists/get').then(
            (result) => {
                console.log(result)
                this.playlists = result
            },
            e => {}
            )
        },
        goToPlaylists() {
            this.toogle = false
            console.log(this.toogle)
        },
        goToMusic() {
            this.toogle = true
            console.log(this.toogle)
        },
        async addTrack(trackId) {
            const data = this.$showModal(Modal, {
                props: { 
                    playlists: this.playlists,
                    trackId: trackId
                }
            })
            console.log(data)
        },
        async createPlaylist() {
            if (this.playlistName != '') {
                await Http.request({
                    url: 'https://rust-square-cotton.glitch.me/playlists/create',
                    method: 'POST',
                    headers: { 
                        "Content-Type": "application/json; charset=utf-8",
                        "Connection": "keep-alive",
                        "access-control-allow-origin": "*"
                    },
                    content: JSON.stringify({name: this.playlistName})
                    }).then(
                    (res) => {
                        console.log(res)
                        this.getPlaylists()
                        this.playlistName = ''
                        this.error = ''
                    }
                    ).catch(err => {
                        console.log(err)
                })
            } else {
                this.error = 'Введите название плейлиста'
            }
        },
        removePlaylist() {
            this.getPlaylists()
        }
    },
    computed: {
        filteredItems() {
            return this.allMusic.filter(item => item.name.toLowerCase().includes(this.searchText.toLowerCase()) || item.artist.toLowerCase().includes(this.searchText.toLowerCase()));
        }
    },
    created() {
        this.getAllMusic(),
        this.getPlaylists()
    }
};
</script>

<style src="../style.scss"></style>
