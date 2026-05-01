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

    useEffect(() => {
        loadSections();
    }, []);

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

    useEffect(() => {
        loadEducationalLevels();
    }, []);


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

    useEffect(() => {
        loadSchedules();
    }, []);


    return (
        <>

            <div className="col-span-full grid md:grid-cols-4 gap-6 items-start">

                {isLoadingEducationalLevels ?
                    (<div className="bg-gray-200 rounded-primary p-6 h-30 animate-pulse space-y-7"></div>)
                    :
                    (
                        <InfoCard
                            variant="compact"
                            icon={LibraryBig}
                            colorIcon="orange"
                            title="Nivel educativo totales"
                            value={educationalLevels.length ? educationalLevels.length.toString() : "Pendiente"}
                            numberTiker = {educationalLevels.length ? true : false}
                        />
                    )}

                {isLoadingSections ?
                    (<div className="bg-gray-200 rounded-primary p-6 h-30 animate-pulse space-y-7"></div>)
                    :
                    (
                        <InfoCard
                            variant="compact"
                            icon={SunMoon}
                            colorIcon="yellow"
                            title="Secciones totales"
                            value={sections.length ? sections.length.toString() : "Por definir"}
                            numberTiker = {sections.length ? true : false}
                        />
                    )}

                {isLoadingSchedules ? (<div className="bg-gray-200 rounded-primary p-6 h-200 animate-pulse space-y-7 col-span-2 row-span-3"></div>) : (<SchedulesManagement schedules={schedules} setSchedules={setSchedules} loadSchedules={loadSchedules} educationalLevels={educationalLevels} sections={sections} />)}
                {isLoadingEducationalLevels ? (<div className="bg-gray-200 rounded-primary p-6 h-150 animate-pulse space-y-7"></div>) : (<LevelsManagement educationalLevels={educationalLevels} setEducationLevels={setEducationalLevels} loadEducationalLevels={loadEducationalLevels} />)}
                {isLoadingSections ? (<div className="bg-gray-200 rounded-primary p-6 h-150 animate-pulse space-y-7"></div>) : (<SectionsManagement sections={sections} setSections={setSections} loadSections={loadSections}/>)}


            </div>

        </>
    )
}




