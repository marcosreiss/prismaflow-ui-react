import { Menu, MenuItem, IconButton } from "@mui/material";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";

type PFRowActionsMenuProps = {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function PFRowActionsMenu({ onView, onEdit, onDelete }: PFRowActionsMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreHorizontal size={18} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {onView && (
                    <MenuItem
                        onClick={() => {
                            onView();
                            setAnchorEl(null);
                        }}
                    >
                        <Eye size={16} style={{ marginRight: 8 }} /> Ver
                    </MenuItem>
                )}
                {onEdit && (
                    <MenuItem
                        onClick={() => {
                            onEdit();
                            setAnchorEl(null);
                        }}
                    >
                        <Pencil size={16} style={{ marginRight: 8 }} /> Editar
                    </MenuItem>
                )}
                {onDelete && (
                    <MenuItem
                        onClick={() => {
                            onDelete();
                            setAnchorEl(null);
                        }}
                        sx={{ color: "error.main" }}
                    >
                        <Trash size={16} style={{ marginRight: 8 }} /> Excluir
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}
