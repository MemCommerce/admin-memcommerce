import type { NoEntitiesProps } from "@/lib/interfaces";
import { TableCell, TableRow } from "@/components/ui/table";

export default function NoEntitiesWrapper<T>({ entities, entitiesName, colSpan, children }: NoEntitiesProps<T>) {
    if (entities.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center">
                    No {entitiesName} found.
                </TableCell>
            </TableRow>
        );
    }

    return <>{children}</>;
}
