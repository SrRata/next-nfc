"use client"

import { InfoCard } from "@/components/info-card";
import { Circle, LibraryBig, Pen, Plus, SunMoon, X } from "lucide-react";
import SchedulesManagement from "./schedules";
import LevelsManagement from "./levels";
import SectionsManagement from "./sections";
import { Section } from "@/types/section";
import { useEffect, useState } from "react";
import axios from "axios";
import { educationalLevel } from "@/types/levels";
import { Schedule } from "@/types/attendance";


export default function SettingsPage() {

    const [sections, setSections] = useState<Section[]>([]);
    const [isLoadingSections, setIsLoadingSections] = useState(true);

    const [educationalLevels, setEducationalLevels] = useState<educationalLevel[]>([]);
    const [isLoadingEducationalLevels, setIsLoadingEducationalLevels] = useState(true);

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

    useEffect(() => {
        async function loadSections() {
            try {
                const response = await axios.get('/api/sections');
                if (response.data.success) {
                    setSections(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching sections:', error)
            } finally {
                setIsLoadingSections(false)
            }
        }
        loadSections();
    }, []);

    useEffect(() => {
        async function loadEducationalLevels() {
            try {
                const response = await axios.get('/api/educational-levels');
                if (response.data.success) {
                    setEducationalLevels(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching educational levels:', error)
            } finally {
                setIsLoadingEducationalLevels(false)
            }
        }
        loadEducationalLevels();
    }, []);

        useEffect(() => {
            async function loadSchedules() {
                try {
                    const response = await axios.get('/api/schedules');
                    if (response.data.success) {
                        setSchedules(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching schedules:', error)
                } finally {
                    setIsLoadingSchedules(false)
                }
            }
            loadSchedules();
        }, []);


    return (
        <>

            <div className="col-span-full grid grid-cols-4 gap-6">
                <InfoCard
                    variant="compact"
                    icon={LibraryBig}
                    colorIcon="orange"
                    title="Niveles educativos totales"
                    value={educationalLevels.length.toString()}
                />
                <InfoCard
                    variant="compact"
                    icon={SunMoon}
                    colorIcon="yellow"
                    title="Secciones totales"
                    value={sections.length.toString()}
                />
                <SchedulesManagement schedules={schedules} educationalLevels={educationalLevels} sections={sections}/>
                <LevelsManagement educationalLevels={educationalLevels} />
                <SectionsManagement sections={sections} />
            </div>

        </>
    )
}




