import Layout from '@/components/Layout'
import Spinner from '@/components/Spinner';
import axios from 'axios'
import { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2';

const SettingsPage = ({swal}) => {
    const [products, setProducts] = useState([]);
    const [featuredProductId, setFeaturedProductId] = useState('');
    const [productsLoading, setProductsIsLoading] = useState(false);
    const [featuredLoading, setFeaturedLoading] = useState(false);
    useEffect(() => {
        setProductsIsLoading(true);
        axios.get('/api/products').then((response) => {
            setProducts(response.data);
            setProductsIsLoading(false);
        });
        setFeaturedLoading(true);
        axios.get('/api/settings?name=featuredProductId').then((response) => {
            setFeaturedProductId(response.data?.value);
            setFeaturedLoading(false);
        });
    }, [])

    const saveSettings = (ev) => {
        ev.preventDefault();
        axios.put('/api/settings',{
            name: 'featuredProductId',
            value: featuredProductId
        }).then((res) => {
            swal.fire({
                title:'Settings saved',
                icon: 'success',
            })
        })
    }

    return (
        <Layout>
            <h1>Store Settings</h1>

            <form onSubmit={saveSettings}>
                {(productsLoading || featuredLoading) && (<Spinner />)}
                {(!productsLoading || !featuredLoading) && (
                    <>
                        <label>Featured product</label>
                        <select 
                        value={featuredProductId}
                        onChange={ev=>setFeaturedProductId(ev.target.value)} name='' id=''>
                            {products.length >0 && products.map((product) =>(
                                <option key={product._id} value={product._id}>
                                    {product.title}
                                </option>
                            ))}
                        </select>
                        <div>
                            <button type='submit' className='btn-primary'>
                                Save settings
                            </button>
                        </div>
                    </>
                )}

            </form>
        </Layout>
    )
}

export default withSwal(({swal})=>(
    <SettingsPage swal={swal}/>
));