import React from 'react'
import {UserButton} from "@clerk/nextjs";
import {MainNav} from "@/components/main-nav";
import StoreSwitcher from "@/components/ui/store-switcher";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
    const {userId} = await auth()
    if (!userId){
        redirect('/sign-in')
    }
    const stores= await prismadb.store.findMany({
        where:{
            userId: userId
        }
    })
    return (
        <div className="border-b">
            <div className="flex h-16 px-4 items-center justify-between space-x-2">
                <div>
                    <StoreSwitcher items={stores}/>
                </div>
                <div>
                    <MainNav/>
                </div>
                <div className='ml-auto flex items-center space-x-4'>
                     <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    )
}
export default Navbar
