

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_login: string;
  role: string;
  provider: string;
  active: boolean;
};


export default function DetailPage() {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("id");


  const [userData, setUserData] = useState<User | null>(null);

  const domain =
    process.env.NEXT_PUBLIC_Phase === "development"
      ? process.env.NEXT_PUBLIC_Backend_Domain
      : "";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${domain}/admin/getUserByID?user_id=${user_id}`);
        const json = await res.json();

        setUserData(json.data);   
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (user_id) {
      fetchDetails();
    }
  }, [user_id]);

  const ChangeActivation = async () => {
    if (!userData) return;

    try {
      const res = await fetch(
        `${domain}/admin/changeActive?user_id=${user_id}&is_active=${!userData.active}`
      );
      const json = await res.json();

      // Update the state to reflect the change
      setUserData((prev) => prev && { ...prev, active: !prev.active });
    } catch (error) {
      console.error("Failed to change activation:", error);
    }
  };

  return (
    <section className="container m-5">
      <h2>User Detail</h2>

      {userData ? (
        <>
          <div>
            <strong>Name: </strong>
            <span>{userData.name}</span>
          </div>
          <div>
            <strong>Email: </strong>
            <span>{userData.email}</span>
          </div>
          <div>
            <strong>Created At: </strong>
            <span>{userData.created_at}</span>
          </div>
          <div>
            <strong>Last LogIn: </strong>
            <span>{userData.last_login}</span>
          </div>
          <div>
            <strong>Role: </strong>
            <span>{userData.role}</span>
          </div>
          <div>
            <strong>Provider: </strong>
            <span>{userData.provider}</span>
          </div>
          <div>
            <strong>Active: </strong>
            <span>{userData.active ? "YES" : "NO"}</span>
            <button className="mx-5 button-primary" onClick={ChangeActivation}>
              Change
            </button>
          </div>
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </section>
  );
}
