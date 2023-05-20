import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const DeleteProductPage = () => {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {id} = router.query;
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response=>{
            setProductInfo(response.data);
        })
    },[id])

    const goBack=()=>{
        router.push('/products');
    }

    const deleteProduct = async ()=>{
        await axios.delete('/api/products?id='+id);
        goBack();
    }
  return (
    <Layout>
        <h1>Dou you really want to delete product "{productInfo?.title}"?</h1>
        <div className='flex gap-2'>
        <button onClick={deleteProduct} className='btn-red'>
            Yes
        </button>
        <button className='btn-default' onClick={goBack}>
            No
        </button>
        </div>
    </Layout>
  )
}

export default DeleteProductPage