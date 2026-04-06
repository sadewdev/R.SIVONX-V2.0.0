// src/app/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/system'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <main className="dark text-foreground bg-background">
                {children}
            </main>
        </HeroUIProvider>
    )
}