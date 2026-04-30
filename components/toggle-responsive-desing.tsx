"use client"

import React, { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Eye, Code2 } from "lucide-react"
import { Safari } from "./ui/safari"
import { Iphone } from "./ui/iphone"
import { Android } from "./ui/android"

export function ToggleResponsiveDesing() {
    const [view, setView] = useState("desktop")

    return (
        <>
            <div className="flex items-center justify-end py-2 px-5">
                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(value) => {
                        if (value) setView(value)
                    }}
                >
                    <ToggleGroupItem className="data-[state=on]:bg-blue-primary data-[state=on]:text-white-primary hover:bg-blue-secondary text-[12px] cursor-pointer font-semibold" value="desktop" aria-label="Ver desktop desing">
                        Desktop
                    </ToggleGroupItem>
                    <ToggleGroupItem className="data-[state=on]:bg-blue-primary data-[state=on]:text-white-primary hover:bg-blue-secondary text-[12px] cursor-pointer font-semibold" value="code" aria-label="ver mobile desing">
                        Mobile
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="h-200 m-5 overflow-hidden">
                {view === "desktop" ? (
                        <Safari className="mx-auto" imageSrc="https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/wp-content/uploads/sites/32/2024/04/Primeros-pasos-de-WP.png/public" />
                ) : (
                        <Android className="h-full mx-auto" src="https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/wp-content/uploads/sites/32/2024/04/Primeros-pasos-de-WP.png/public"/>
                )}
            </div>
        </>
    )
}
