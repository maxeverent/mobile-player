<template>
    <Page>
        <StackLayout class="modal-background">
            <PlaylistItem v-for="playlist, index in playlists" 
                :playlist="playlist" 
                :key="index" 
                :trackId="trackId" 
                @closeModal="closeModal"
                class="playlist-item"/>
            <Label v-if="message != ''" class="error">{{ message }}</Label>
        </StackLayout>
    </Page>
</template>

<script>

import PlaylistItem from './PlaylistItem'

export default {
    data() {
        return {
            message: ''
        }
    },
    components: {
        PlaylistItem
    },
    methods: {
        closeModal(data) {
            if (data.data == 200) {
                this.$modal.close()
            } else {
                this.message =  "Такой трек уже существует"
                setTimeout(() => {this.$modal.close()}, 1000)
            }
        }
    },
    props: {
        playlists: Array,
        trackId: Number
    }
}

</script>

<style src="../style.scss"></style>