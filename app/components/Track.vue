<template>
    <FlexboxLayout class="background">
        <StackLayout class="track">
            <Label class="track-name">{{ track.name }}</Label>
            <Label class="track-artist">{{ track.artist }}</Label>
        </StackLayout>
        <StackLayout orientation="horizontal" class="btns">
            <Button @tap="play()" class="play"/>
            <Button @tap="addTrack()" class="add"/>
        </StackLayout>
    </FlexboxLayout>
</template>

<script>


export default {
    data() {
        return {

        }
    },
    props: {
        track: Object,
        index: Number,
    },
    methods: {
        play() {
            this.$emit('playTrack', this.index)
            console.log(this.index)
        },
        addTrack() {
            this.$emit('addTrack', this.track.id)
            this.$store.dispatch('addTrack', this.track.id)
        }
        // async addTrack() {
        //     await Http.request({
        //     url: 'https://rust-square-cotton.glitch.me/playlist/create/1',
        //     method: 'POST',
        //     headers: { 
        //         "Content-Type": "application/json; charset=utf-8",
        //         "Connection": "keep-alive",
        //         "access-control-allow-origin": "*"
        //     },
        //     content: JSON.stringify({track_id: this.track.id})
        //     }).then(
        //     (res) => {
        //        console.log(res)
        //     },
        //     e => {}
        //     )
        // }
    }
}

</script>

<style src="../style.scss" lang="scss"></style>