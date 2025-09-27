<script setup lang="ts">
// Props for playlist data and current track
interface Track {
  artist: string
  track: string
}

interface Props {
  playlist: Track[]
  currentTrackIndex: number
}

defineProps<Props>()

// Emit events for track selection
const emit = defineEmits<{
  selectTrack: [index: number]
}>()

const selectTrack = (index: number) => {
  emit("selectTrack", index)
}
</script>

<template>
  <div class="playlist-wrapper">
    <div class="playlist-panel">
      <div class="playlist-panel__box">
        <div class="playlist-panel__header">PLAYLIST</div>
        <div class="playlist-panel__tracks">
          <div
            v-for="(track, index) in playlist"
            :key="index"
            class="playlist-panel__track"
            :class="{
              'playlist-panel__track--current': index === currentTrackIndex,
            }"
            @click="selectTrack(index)"
          >
            <span class="playlist-panel__track-number">{{
              String(index + 1).padStart(2, "0")
            }}</span>
            <span class="playlist-panel__track-info"
              >{{ track.artist }} - {{ track.track.replace(".mp3", "") }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playlist-wrapper {
  position: relative;
  width: 280px;
  margin-top: 10px;
}

.playlist-wrapper * {
  font-family: $sans-text;
  color: $accent2;
  font-size: 9px;
  font-weight: 400;
}

.playlist-panel {
  display: flex;
  justify-content: center;
  color: $accent2;
  background-color: #1e1e1e;
  border: 2px solid $secondary;
  border-radius: 16px;
  text-transform: uppercase;
  min-height: 120px;

  &__box {
    position: relative;
    top: 6px;
    width: 265px;
    border-radius: 4px;
    padding: 5px;
    overflow: hidden;
    background-color: #1e1e1e;
    user-select: none;
    margin-bottom: 6px;
  }

  &__header {
    text-align: center;
    padding: 4px 0;
    border-bottom: 1px solid $accent1;
    margin-bottom: 6px;
    font-size: 8px;
    letter-spacing: 1px;
  }

  &__tracks {
    max-height: 80px;
    overflow-y: auto;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: $accent1;
      border-radius: 2px;
    }
  }

  &__track {
    display: flex;
    align-items: center;
    padding: 3px 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 2px;
    margin-bottom: 1px;

    &:hover {
      background-color: rgba(132, 166, 165, 0.1);
    }

    &--current {
      background-color: rgba(132, 166, 165, 0.2);
      color: $secondary;

      .playlist-panel__track-number {
        color: $secondary;
      }
    }
  }

  &__track-number {
    min-width: 20px;
    color: $accent1;
    margin-right: 8px;
    font-size: 8px;
  }

  &__track-info {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 8px;
  }
}
</style>
