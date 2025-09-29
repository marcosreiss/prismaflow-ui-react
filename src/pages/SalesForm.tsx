import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Sale } from "@/types/saleTypes";
import type { Product } from "@/types/productTypes";
import { useSale } from "@/hooks/useSale";
import { useCustomer } from "@/hooks/useCustomer";
import { useProduct } from "@/hooks/useProduct";
import { useNotification } from "@/context/NotificationContext";
import CurrencyInput from "@/components/imask/CurrencyInput";
import {
    Paper,
    Box,
    Typography,
    Button,
    Divider,
    Stack,
    Autocomplete,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import type { Prescription } from "@/types/prescriptionTypes";

const defaultValues: Partial<Sale> = {
    client: undefined,
    productItems: [],
    serviceItems: [],
    discount: 0,
    notes: "",
    isActive: true,
    subtotal: 0,
    total: 0,
};

export default function SaleForm() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    // --- HOOKS TODOS AQUI ---
    const { list: { data: customers, isLoading: isLoadingCustomers } } = useCustomer(null);
    const { list: { data: products, isLoading: isLoadingProducts } } = useProduct(null);
    const { create, creating } = useSale(null);

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Sale>({
        defaultValues: defaultValues as Sale,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "productItems",
    });

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    const watchedProductItems = watch("productItems") || [];
    const watchedDiscount = watch("discount");

    // --- LÓGICA TODA AQUI ---
    useEffect(() => {
        const calculatedSubtotal = watchedProductItems.reduce((acc, item) => {
            const price = (item as any).product?.salePrice || 0;
            const quantity = (item as any).quantity || 0;
            return acc + price * quantity;
        }, 0);
        const calculatedTotal = calculatedSubtotal - (watchedDiscount || 0);
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedTotal);
        setValue("subtotal", calculatedSubtotal);
        setValue("total", calculatedTotal);
    }, [watchedProductItems, watchedDiscount, setValue]);

    const handleAddProduct = () => {
        if (selectedProduct) {
            // ANTES
            // append({ product: selectedProduct, quantity: 1 });

            // DEPOIS (mais completo e seguro)
            append({
                product: selectedProduct,
                quantity: 1,
                frameDetails: null,
            });

            setSelectedProduct(null);
        }
    };

    const methods = useForm<Sale>({ defaultValues: defaultValues as Sale });

    // ESTADO PARA CONTROLAR O MODAL DA RECEITA
    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

    // Assiste ao campo 'protocol' para saber se já existe uma receita
    const protocol = methods.watch("protocol");

    // Função para salvar os dados da receita vindos do modal
    const handleSavePrescription = (prescriptionData: Prescription) => {
        methods.setValue("protocol.prescription", prescriptionData, { shouldDirty: true });
        setPrescriptionModalOpen(false); // Fecha o modal
    };

    const onSubmit = async (data: Sale) => {
        if (!data.client?.id) {
            addNotification("Por favor, selecione um cliente.", "warning");
            return;
        }

        try {
            // 1. TRANSFORMA OS DADOS DO FORMULÁRIO PARA O FORMATO DA API
            const payload = {
                // Relações diretas usam 'Id' no nome do campo
                clientId: data.client.id,

                // Campos financeiros são enviados diretamente
                subtotal: data.subtotal,
                discount: data.discount,
                total: data.total,

                // Listas de itens são transformadas com .map()
                productItems: data.productItems.map(item => ({
                    productId: (item as any).product.id,
                    quantity: (item as any).quantity,
                    // Detalhes da armação, se existirem, podem ser enviados diretamente
                    frameDetails: (item as any).frameDetails,
                })),

                serviceItems: data.serviceItems.map(item => ({
                    serviceId: (item as any).service.id,
                })),

                // Campos complexos como 'protocol' e 'payment' virão de outras
                // partes do formulário que ainda não implementamos.
                // Por enquanto, não os enviaremos.
            };

            console.log("PAYLOAD FINAL PARA ENVIAR:", payload);

            await create(payload as any); // Usamos 'as any' porque o tipo do payload é diferente do tipo 'Sale' do formulário

            addNotification("Venda criada com sucesso!", "success");
            navigate("/sales");

        } catch (error) {
            console.error("Erro ao criar venda:", error);
            addNotification("Erro ao criar a venda. Tente novamente.", "error");
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Nova Venda</Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                    {/* Coluna Principal */}
                    <Stack spacing={3} sx={{ flex: 2 }}>
                        {/* --- Seção 1: Cliente --- */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>1. Selecione o Cliente</Typography>
                            <Controller
                                name="client"
                                control={control}
                                rules={{ required: "O cliente é obrigatório" }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={customers || []}
                                        getOptionLabel={(option) => option.name || ""}
                                        loading={isLoadingCustomers}
                                        value={customers?.find((c) => c.id === field.value?.id) || null}
                                        onChange={(_, newValue) => field.onChange(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Buscar cliente" required error={!!errors.client} helperText={(errors.client?.message as string) || ""} />}
                                    />
                                )}
                            />
                        </Box>

                        {/* --- Seção 2: Adicionar Itens --- */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>2. Adicionar Itens</Typography>
                            <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                                <Autocomplete
                                    sx={{ flexGrow: 1 }}
                                    options={products || []}
                                    getOptionLabel={(option) => option.name || ""}
                                    loading={isLoadingProducts}
                                    value={selectedProduct}
                                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Buscar produto" />}
                                />
                                <Button variant="outlined" onClick={handleAddProduct} disabled={!selectedProduct} sx={{ height: 56 }}>Adicionar</Button>
                            </Stack>
                        </Box>

                        {/* --- Tabela de Itens Adicionados --- */}
                        {fields.length > 0 && (
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="center" sx={{ width: 100 }}>Qtd.</TableCell>
                                            <TableCell align="right">Preço Unit.</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="center">Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{(item as any).product.name}</TableCell>
                                                <TableCell>
                                                    <Controller
                                                        control={control}
                                                        name={`productItems.${index}.quantity`}
                                                        render={({ field }) => <TextField {...field} type="number" size="small" sx={{ "& input": { textAlign: "center" } }} inputProps={{ min: 1, style: { padding: '8.5px 6px' } }} onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)} />}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{((item as any).product.salePrice || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                                                <TableCell align="right">{((item as any).quantity * ((item as any).product.salePrice || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" onClick={() => remove(index)} color="error"><Trash2 size={18} /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Stack>

                    {/* Coluna Lateral */}
                    <Box sx={{ flex: 1 }}>
                        <Paper variant="outlined" sx={{ p: 2, position: "sticky", top: 80 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Resumo da Venda</Typography>
                            <Stack spacing={1.5}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                                    <Typography variant="body1">{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1" color="text.secondary">Desconto (R$)</Typography>
                                    <Controller
                                        name="discount"
                                        control={control}
                                        render={({ field }) => <CurrencyInput size="small" label="" value={typeof field.value === "number" ? field.value : 0} onChange={(val) => field.onChange(val)} sx={{ width: 120 }} />}
                                    />
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                    <Button variant="outlined" color="secondary" onClick={() => navigate("/sales")}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={creating}>{creating ? "Salvando..." : "Finalizar Venda"}</Button>
                </Box>
            </form>
        </Paper>
    );
}