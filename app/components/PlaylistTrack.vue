<template>
    <FlexboxLayout class="background-track">
        <StackLayout class="track">
            <Label v-model="track.name" class="track-name"></Label>
            <Label v-model="track.artist" class="track-artist"></Label>
        </StackLayout>
        <StackLayout orientation="horizontal" class="btns">
            <Button @tap="play()" class="play"/>
            <Button @tap="removeTrack()" class="del"/>
        </StackLayout>
    </FlexboxLayout>
</template>

<script>

import { Http } from '@nativescript/core'

export default {
    data() {
        return {

        }
    },
    props: {
        track: Object,
        index: Number,
        playlist: Object,
    },
    methods: {
        play() {
            this.$emit('playPlaylistTrack', this.index)
        },
        async removeTrack() {
            await Http.request({
            url: 'https://rust-square-cotton.glitch.me/playlist/delete/' + this.playlist.id,
            method: 'DELETE',
            headers: { 
                "Content-Type": "application/json; charset=utf-8",
                "Connection": "keep-alive",
                "access-control-allow-origin": "*"
            },
            content: JSON.stringify({track_id: this.track.id})
            }).then(
            (res) => {
               console.log(res)
            },
            e => {}
            )
            this.$emit('removeTrack', {index: this.index, trackId: this.track.id})
            this.$store.dispatch('deleteTrack', this.index)
        }
    }
}

</script>