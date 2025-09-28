import { Menu, MenuItem, IconButton } from "@mui/material";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";

type PFRowActionsMenuProps = {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function PFRowActionsMenu({
    onView,
    onEdit,
    onDelete,
}: PFRowActionsMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    // aumenta a área de clique em tablets/mobiles
                    width: { xs: 40, sm: 36 },
                    height: { xs: 40, sm: 36 },
                }}
            >
                <MoreHorizontal size={20} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        minWidth: { xs: 140, sm: 160 }, // ajusta largura mínima em mobile/tablet
                        "& .MuiMenuItem-root": {
                            fontSize: { xs: "0.85rem", sm: "0.9rem" }, // fonte menor no mobile
                            py: { xs: 1, sm: 1.2 }, // padding ajustado
                        },
                    },
                }}
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
