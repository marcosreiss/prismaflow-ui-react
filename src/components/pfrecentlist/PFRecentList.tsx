import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

export type PFRecentListProps = {
    title: string;
    items: { id: number; name: string; value: string }[];
};

export default function PFRecentList({ title, items }: PFRecentListProps) {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <CardContent>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {title}
                </Typography>
                <List disablePadding>
                    {items.map((item) => (
                        <ListItem key={item.id} divider>
                            <ListItemText
                                primary={item.name}
                                secondary={item.value}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
