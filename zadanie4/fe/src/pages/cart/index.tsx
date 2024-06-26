import { FC, useEffect, useState } from 'react';
import NavButton from '../../components/NavButton';
import { FaHome } from "react-icons/fa";
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { LocalStorageProduct } from '../../types/LocalStorageProduct';
import FormInput from '../../components/FormInput';
import Error from '../../components/Error';
import { OrderStatus } from '../../types/OrderStatus';
import { API } from '../../api/api.config';

const CartPage: FC = () => {
    const navigation = useNavigate();
    const [products, setProducts] = useState<LocalStorageProduct[]>([]);
    const [status, setStatus] = useState<OrderStatus[]>([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: ''
    });
    const [isEmptyCart, setIsEmptyCart] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const handleStatus = async () => {
            try {
                const response = await API.get('/status');
                const data = response.data as OrderStatus[];
                setStatus(data);
            } catch (error) {
                console.error(error);
            }
        }
        handleStatus();
        const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');
        setProducts(existingProducts);
    }, []);

    const handleClick = () => {
        navigation('/');
    }

    function handleQuantityChange(productId: string, quantity: number): void {
        if (quantity < 1) {
            setIsError(true);
            return;
        }
        const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');
        const product = existingProducts.find((p: LocalStorageProduct) => p.product._id === productId);
        if (product) {
            product.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(existingProducts));
            setProducts(existingProducts);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        const handleBuy = async () => {
            const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');
            const { username, email, phoneNumber } = formData;
            const foundStatus = status.find((status) => status.name === 'UNAPPROVED')?._id;
            const products = existingProducts.map((product: LocalStorageProduct) => {
                return {
                    productId: product.product._id,
                    quantity: product.quantity
                }
            });
            const requestBody = {
                approvalDate: null,
                orderStatusId: foundStatus,
                username,
                email,
                phoneNumber,
                products,
            };
            try {
                const response = await API.post('/orders', requestBody);
                const data = response.data;
                console.log(data);
                localStorage.removeItem('cart');
                setProducts([]);
                navigation('/');
            } catch (error) {
                console.error(error);
            }
        }
        e.preventDefault();
        if (products.length === 0) {
            setIsEmptyCart(true);
            return;
        }
        handleBuy();
    }

    return (
        <Layout button={<NavButton onClick={handleClick} text='Home Page' icon={<FaHome />} />}>
            <>
                {isError && <Error value='Quantity must be greater than 0' />}
                {isEmptyCart && <Error value='Cart is empty' />}
                <table className='table-auto mt-5 w-full'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>Name</th>
                            <th className='px-4 py-2'>Quantity</th>
                            <th className='px-4 py-2'>Price</th>
                            <th className='px-4 py-2'>Total</th>
                            <th className='px-4 py-2'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.product._id}>
                                <td className='border px-4 py-2'>{product.product.name}</td>
                                <td className='border px-4 py-2 w-3/12'>
                                    <input
                                        type='number'
                                        className='text-white_text
                                    bg-dark_gray
                                    w-full'
                                        value={product.quantity}
                                        min={1}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                product.product._id,
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                                <td className='border px-4 py-2'>{product.product.price}</td>
                                <td className='border px-4 py-2'>{product.quantity ? product.product.price * product.quantity : product.product.price}</td>
                                <td className='border px-4 py-2 text-center cursor-pointer hover:text-nice_green' onClick={() => {
                                    const existingProducts = JSON.parse(localStorage.getItem('cart') || '[]');
                                    const newProducts = existingProducts.filter((p: LocalStorageProduct) => p.product._id !== product.product._id);
                                    localStorage.setItem('cart', JSON.stringify(newProducts));
                                    setProducts(newProducts);
                                }}>Delete</td>
                            </tr>
                        ))}
                        <tr>
                            <td className='border-0 px-4 py-2' colSpan={2}></td>
                            <td className='border px-4 py-2'>Total</td>
                            <td className='border px-4 py-2'>{products.reduce((acc, product) => acc + (product.quantity ? product.product.price * product.quantity : product.product.price), 0)}</td>
                        </tr>
                    </tbody>
                </table>
                <div className='w-full flex justify-center'>
                    <form className='w-8/12' onSubmit={handleSubmit}>
                        <FormInput label='Username' type='text' value={formData.username} onChange={(e) => {
                            setFormData({
                                ...formData,
                                username: e.target.value.replace(' ', '')
                            });
                        }} />
                        <FormInput label='Email' type='email' value={formData.email} onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.target.value.replace(' ', '')
                            });
                        }} />
                        <FormInput label='Phone number' type='text' size={9} value={formData.phoneNumber} onChange={(e) => {
                            const inputText = e.target.value.replace(' ', '');
                            if (/^\d+$/.test(inputText) || inputText === '') {
                                setFormData({
                                    ...formData,
                                    phoneNumber: inputText
                                });
                            }
                        }} />
                        <input type='submit' value='Buy' className='border py-1 px-6 rounded hover:cursor-pointer hover:text-nice_green hover:border-nice_green' />
                    </form>
                </div>

            </>
        </Layout>
    );
};

export default CartPage;
