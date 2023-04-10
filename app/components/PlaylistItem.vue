<template>
    <StackLayout @tap="addTrack()" class="playlsit-item">
        <Label class="name">{{ playlist.name }}</Label>
    </StackLayout>
</template>

<script>

import { Http } from '@nativescript/core'

export default {
    props: {
        playlist: Object,
        trackId: Number
    },
    methods: {
        async addTrack() {
            await Http.request({
                url: 'https://rust-square-cotton.glitch.me/playlist/create/' + this.playlist.id,
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json; charset=utf-8",
                    "Connection": "keep-alive",
                    "access-control-allow-origin": "*"
                },
                content: JSON.stringify({track_id: this.trackId})
                }).then(
                (res) => {
                console.log(res)
                this.$emit('closeModal', {data: res.statusCode})
                }
                ).catch(err => {
                    console.log(err)
            })
        }
    }
}

</script>

<style src="../style.scss"></style>