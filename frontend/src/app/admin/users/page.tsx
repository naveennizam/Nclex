"use client"
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/app/context/AuthContext';
import React from 'react';
import { GetUsers } from '@/app/forTable/types/user';
import { columns } from '@/app/forTable/Column/users';

interface User {
  id: string;

}



export default function DetailPage() {


  const [otherUsers, setOtherUsers] = useState<GetUsers[]>([]);
  const [adminTotal, setAdminTotal] = useState(0);
  const [users, setUsers] = useState<GetUsers[]>([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const pageSize = 10;
  const { user } = useAuth() as { user: User };

  useEffect(() => {
    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''

    const details_result = async () => {
      try {
        const userUrl = `${domain}/admin/get_users?limit=${pageSize}&offset=${page * pageSize}`;
        const teamUrl = `${domain}/admin/get_team_members`;

        // Run both fetches in parallel
        const [userRes, teamRes] = await Promise.all([fetch(userUrl), fetch(teamUrl)]);

        // Parse both JSON responses
        const [userJson, teamJson] = await Promise.all([userRes.json(), teamRes.json()]);

        setUsers(userJson.data);
        setTotal(userJson.total);

        setOtherUsers(teamJson.data);
        setAdminTotal(teamJson.total);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    details_result()
  }, [])


  useEffect(() => {
    const loadUsers = async () => {
      const domain =
        process.env.NEXT_PUBLIC_Phase === 'development'
          ? process.env.NEXT_PUBLIC_Backend_Domain
          : '';

      try {
        const res = await fetch(
          `${domain}/admin/get_users?limit=${pageSize}&offset=${page * pageSize}`
        );

        const userJson = await res.json();

        setUsers(userJson.data);
        setTotal(userJson.total);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    loadUsers();
  }, [page]);


  return (
    <section className='container m-5'>

      <Tabs defaultValue="users" className="w-[1000px]  ">
        <TabsList className="tabsList grid grid-cols-2 w-full rounded-md p-1">
          <TabsTrigger
            value="users"
            className="tab-btn" >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="teamMembers"
            className="tab-btn"
          >
            Admins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">

          <div className=" mx-auto px-4 py-6">
            {(users || []).length > 0 && (
              <div className="p-4">
                <h1 className="text-xl font-bold mb-4">User </h1>
                <DataTable<GetUsers> columns={columns} data={users} />


                <div className="mt-4 flex items-center justify-between">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="button-primary"
                  >
                    Previous
                  </button>
                  <span>
                    Page {page + 1} of {Math.ceil(total / pageSize)}
                  </span>
                  <button
                    disabled={(page + 1) * pageSize >= total}
                    onClick={() => setPage((p) => p + 1)}
                    className="button-success"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teamMembers">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {(otherUsers || []).length > 0 && (
              <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Admin</h1>
                <DataTable<GetUsers> columns={columns} data={otherUsers} />


              </div>
            )}
          </div>
        </TabsContent>


      </Tabs >
    </section>
  )
}