import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'

export default defineConfig({
    presets: [presetUno(), presetAttributify(), presetIcons({ scale: 1.2, warn: true })],
    theme: {
        colors: {
            primary: 'var(--primary-color)',
            dark_bg: 'var(--dark-bg)'
        }
    }
})
