import { InfoCard } from "@/components/info-card";
import { Percent, UserMinus, Users } from "lucide-react";
import ReportsTable from "./reports-table";
import { ReportChart } from "./report-chart";


export default function reportsPage() {
    return (
        <>
            <InfoCard variant="compact" icon={Percent} colorIcon="blue" title="Asistencia media" value="92.4%" alert="+2.1% vs al mes anterior" alertColor="green"/>
            <InfoCard variant="compact" icon={Users} colorIcon="red" title="Total faltas" value={42} alert="En el periodo lectivo actual"/>
            <InfoCard variant="compact" icon={UserMinus} colorIcon="orange" title="Estudiantes en alerta" value={15} alert=">20% de asistencia" alertColor="red"/>
            
            <ReportChart/>

            <ReportsTable/>
        </>
    )
}
