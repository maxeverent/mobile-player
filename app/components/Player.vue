<template>
    <StackLayout class="player-body">
        <StackLayout class="track-info">
            <Label class="name">{{ trackName }}</Label>
            <Label class="artist">{{ trackArtist }}</Label>
        </StackLayout>
        <StackLayout class="player-btns">
            <Progress :value="progress" @tap="updateSeek($event)" class="progress"/>
            <StackLayout class="btns" orientation="horizontal">
                <Button class="prev" @tap="prev()"></Button>
                <Button v-if="isPlaying" @tap="resumeOrPause()" class="stop"></Button>
                <Button v-else @tap="resumeOrPause()" class="play"></Button>
                <Button class="next" @tap="next()"></Button>
            </StackLayout>
        </StackLayout>
    </StackLayout>
</template>

<script>

const audio = require('nativescript-audio');

export default {
    data() {
        return {
            player: new audio.TNSPlayer(),
            progress: 0,
            isPlaying: false,
            duration: '',
            trackName: '-',
            trackArtist: '-',
        }
    },
    props: {
        music: Array,
        index: Number,
        status: String,
        playlistTracks: Array,
        currentPlaylistTrack: Number,
    },
    methods: {
        async play()
        {
            if (this.status === 'allMusic') {
                console.log(this.index)
                this.trackName = this.music[this.index - 1].name
                this.trackArtist = this.music[this.index - 1].artist
                let playerOptions = {
                    audioFile: 'https://rust-square-cotton.glitch.me/music/file/' + this.index,
                    loop: false,
                    errorCallback: function (errorObject) 
                    {
                        console.log(JSON.stringify(errorObject));
                    },
                    infoCallback: function (args) 
                    {
                        console.log(JSON.stringify(args));
                    }
                }
                this.isPlaying = true
                await this.player.playFromUrl(playerOptions)        
                .then(res => 
                {
                    console.log(res);
                    this.isPlaying = true
                })
                .catch(err => {
                    console.log('something went wrong...', err);
                    this.isPlaying = false
                })
                await this.player.getAudioTrackDuration()
                    .then(res => this.duration = res*0.001 - 1)
                    .catch(err => console.log(err))
                this.duration = this.duration
                const setInt = setInterval(() => {
                    if (this.player.currentTime*0.001 < this.duration) {
                        this.progress = ((this.player.currentTime*0.1)/this.duration)
                    }
                    else {
                        this.progress = 0
                        clearInterval(setInt)
                        if (this.index != this.music.length) {
                            this.index += 1
                            this.play()
                        } else {
                            this.isPlaying = false
                        }
                    }
                }, 500)
            } 
            if (this.status == 'Playlist') {
                //this.trackName = this.music[this.playlistTracks[this.currentPlaylistTrack] - 1].name
                //this.trackArtist = this.music[this.playlistTracks[this.currentPlaylistTrack] - 1].artist
                this.trackName = this.music[this.$store.state.playlistTracks[this.currentPlaylistTrack] - 1].name
                this.trackArtist = this.music[this.$store.state.playlistTracks[this.currentPlaylistTrack] - 1].artist
                let playerOptions = {
                    audioFile: 'https://rust-square-cotton.glitch.me/music/file/' + this.$store.state.playlistTracks[this.currentPlaylistTrack],
                    loop: false,
                    errorCallback: function (errorObject) 
                    {
                        console.log(JSON.stringify(errorObject));
                    },
                    infoCallback: function (args) 
                    {
                        console.log(JSON.stringify(args));
                    }
                }
                this.isPlaying = true
                await this.player.playFromUrl(playerOptions)        
                .then(res => 
                {
                    console.log(res);
                    this.isPlaying = true
                })
                .catch(err => {
                    console.log('something went wrong...', err);
                    this.isPlaying = false
                })
                await this.player.getAudioTrackDuration()
                    .then(res => this.duration = res*0.001 - 1)
                    .catch(err => console.log(err))
                const setInt = setInterval(() => {
                    if (this.player.currentTime*0.001 < this.duration) {
                        this.progress = ((this.player.currentTime*0.1)/this.duration)
                    }
                    else {
                        this.progress = 0
                        clearInterval(setInt)
                        if (this.$store.state.playlistTracks[this.currentPlaylistTrack + 1]) {
                            this.currentPlaylistTrack += 1
                            this.play()
                        } else {
                            this.isPlaying = false
                        }
                    }
                }, 500)
            }  
        },
        resumeOrPause() {
            if (this.isPlaying == false) {
                this.player.play()
                this.isPlaying = true
            } else {
                this.player.pause()
                this.isPlaying = false
            }
        },
        updateSeek(event) {
            let mousePos = event.getX()
            const elWidth = 371.5
            let time = ((mousePos/elWidth)*100)
            this.progress = time
            console.log((time*this.duration)/100)
            this.player.seekTo(Math.floor((time*this.duration)/100))
        },
        next() {
            if (this.status === 'allMusic') {
                if (this.index != this.music.length) {
                    this.index +=1
                    this.play()
                }
            }
            if (this.status === 'Playlist') {
                if (this.$store.state.playlistTracks[this.currentPlaylistTrack + 1]) {
                    this.currentPlaylistTrack +=1
                    this.play()
                }
            }
        },
        prev() {
            if (this.status === 'allMusic') {
                if (this.index != 1) {
                    this.index -=1
                    this.play()
                }
            }
            if (this.status === 'Playlist') {
                if (this.$store.state.playlistTracks[this.currentPlaylistTrack - 1]) {
                    this.currentPlaylistTrack -=1
                    this.play()
                }
            }
        },
        volumePlus() {
            this.player.volume = 0.8
            console.log(this.player.volume)
        },
        volumeMin() {
            this.player.volume -= 0.2
            console.log(this.player.volume)
        }
    }
}

</script>