"use client"

import {Check, ChevronsUpDown, PlusCircle, Store as StoreIcon} from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Store } from "@prisma/client";
import {useStoreModal} from "@/hooks/use-store-modal";
import {useParams, useRouter} from "next/navigation";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps{
    items: Store[];
}

export default function StoreSwitcher({
    className,
    items=[]}: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }))


    const currentStore = formattedItems.find((item)=> item.value === params.storeId);
    const [open, setOpen] = useState(false);
    const onStoreSelect = (store: {value: string, label:string}) => {
        setOpen(false)
        router.push(`/${store.value}`);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button variant="outline" size='sm' role="combobox" aria-expanded={open} aria-label="select a store"
                className={cn("w-200px justify-between", className)}>

                    <StoreIcon className='mr-2 h-2 w-4'/>
                    {currentStore?.label}
                    <ChevronsUpDown/>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandList>
                        <CommandInput placeholder='search store..'/>
                        <CommandEmpty>No store found</CommandEmpty>
                        <CommandGroup heading='stores'>
                            {formattedItems.map((store) => (
                                <CommandItem key={store.value} className='text-sm' onSelect={() => onStoreSelect(store)}>
                                    <StoreIcon className='mr-2 h-2 w-4'/>
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentStore?.value == store.value ? "opacity:100" : "opacity-0" )}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {setOpen(false);
                            storeModal.onOpen()}}>
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}