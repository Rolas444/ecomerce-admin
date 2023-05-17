import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
// import ProductsForm from '@/components/ProductForm';

const ProductForm = ({ _id, title: existingTitle, description: existingDescription, price: existingPrice }) => {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    const saveProduct = async (ev) => {
        ev.preventDefault();
        const data = {title,description, price};
        if (_id) {
            //update
            await axios.put('/api/products', {...data, _id});
            
        } else {
            //create
            await axios.post('/api/products', data);
            
        }
        setGoToProducts(true);

    }
    if (goToProducts) {
        router.push("/products");
    }
    return (
        <>
            <form onSubmit={saveProduct}>
                <label>name</label>
                <input value={title} onChange={ev => setTitle(ev.target.value)} type='text' placeholder='product name' />
                <label>description</label>
                <textarea
                    placeholder='description'
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                >
                </textarea>
                <label>price (in USD)</label>
                <input
                    type='number'
                    placeholder='0.00'
                    value={price}
                    onChange={ev => setPrice(ev.target.value)}
                />
                <button
                    type='submit'
                    className='btn-primary'
                >Save</button>
            </form>
        </>
    )
}

export default ProductForm