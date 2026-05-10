"use client"

import { Suspense, useEffect, useState } from "react";
import { TableSkeleton } from "@/components/table";
import { UsersTable } from "./table";
import { Users } from "lucide-react";
import { InfoCard } from "@/components/info-card";
import { MetricsAdmin } from "@/types/metrics";
import axios from "axios";
import { user } from "@/types/users";

export default function UserPage() {

  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<user[]>([])

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await axios.get('/api/usersc');
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const total_admins = users.filter(user => user.role === 'admin').length
  const total_teachers = users.filter(user => user.role === 'profesor').length
  const total_users = users.filter(user => user.role === 'usuario').length



  return (
    <>

      <InfoCard
        icon={Users}
        colorIcon="purple"
        title="Total administradores"
        value={total_admins? total_admins : "--"}
        variant="compact"
      />

      <InfoCard
        icon={Users}
        colorIcon="blue"
        title="Total profesores"
        value={total_teachers ? total_teachers : "--"}
        variant="compact"
      />

      <InfoCard
        icon={Users}
        colorIcon="green"
        title="Total representantes"
        value={total_users? total_users : "--"}
        variant="compact"
      />

      <Suspense fallback={<TableSkeleton />}>
        <UsersTable setUsers={setUsers} users={users} isLoading={isLoading}   />
      </Suspense>
    </>
  );
}
