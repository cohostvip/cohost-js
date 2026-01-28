import type { Config } from 'tailwindcss'

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        ticketing: {
          primary: 'var(--ticketing-primary)',
          'primary-hover': 'var(--ticketing-primary-hover)',
          accent: 'var(--ticketing-accent)',
          background: 'var(--ticketing-background)',
          surface: 'var(--ticketing-surface)',
          'surface-hover': 'var(--ticketing-surface-hover)',
          text: 'var(--ticketing-text)',
          'text-muted': 'var(--ticketing-text-muted)',
          border: 'var(--ticketing-border)',
          success: 'var(--ticketing-success)',
          error: 'var(--ticketing-error)',
          warning: 'var(--ticketing-warning)',
        },
      },
      fontFamily: {
        ticketing: 'var(--ticketing-font-family)',
      },
      borderRadius: {
        'ticketing-sm': 'var(--ticketing-radius-sm)',
        'ticketing-md': 'var(--ticketing-radius-md)',
        'ticketing-lg': 'var(--ticketing-radius-lg)',
      },
    },
  },
}

export default preset
