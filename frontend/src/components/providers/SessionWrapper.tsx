"use client"

import { SessionProvider} from 'next-auth/react';

export default function SessionWrapper({children,props}){
    return(
    <SessionProvider session={props}>
        {children}
    </SessionProvider>
    )
}

