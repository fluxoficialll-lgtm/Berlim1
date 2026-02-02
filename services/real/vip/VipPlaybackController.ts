
/**
 * VipPlaybackController
 * Isola a lógica de reprodução exclusiva para garantir UX premium.
 */
export const VipPlaybackController = {
    /**
     * Define qual o próximo índice de vídeo que deve tocar, 
     * pausando o anterior caso necessário.
     */
    togglePlayback(currentIndex: number | null, clickedIndex: number): number | null {
        if (currentIndex === clickedIndex) {
            return null; // Pause
        }
        return clickedIndex; // Play novo
    },

    /**
     * Determina se o playback deve ser resetado ao mudar de slide.
     */
    shouldStopOnScroll(currentSlide: number, playingIndex: number | null): boolean {
        return playingIndex !== null;
    }
};
