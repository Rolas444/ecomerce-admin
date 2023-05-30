import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import { withSwal } from "react-sweetalert2";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";

const AdminsPage = ({swal}) => {
    const [email, setEmail] = useState('');
    const [adminEmails, setAdminEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const addAdmin = (ev) => {
        ev.preventDefault();
        axios.post('/api/admins', {email}).then(res=>{
            swal.fire({
                title: 'Admin created!',
                icon: 'success'
            })
            setEmail('');
            loadAdmins();
        }).catch(err=>{
            swal.fire({
                title: 'Error!',
                text: err.response.data.message,
                icon: 'error'
            })
        });
    }
    const loadAdmins= ()=>{
        setIsLoading(true);
        axios.get('/api/admins').then(res=>{
            setAdminEmails(res.data);
            setIsLoading(false);
        });
    }
    const deleteAdmin= async (adminemail)=>{
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${adminemail.email}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }). then (async result =>{
            if(result.isConfirmed){
                axios.delete('/api/admins?_id='+adminemail._id).then(()=>{
                    swal.fire({
                        title: 'Admin deleted!',
                        icon: 'success',
                    });
                    loadAdmins();
                })
            }
        })
        
    }

    useEffect(()=>{
        loadAdmins();
    },[])

    return (
        <Layout>
            <h1>Admins</h1>
            <h2>Add new admin</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input type="text" 
                    className="mb-0" 
                    value={email}
                    onChange={ev=>setEmail(ev.target.value)}
                    placeholder="google email" />
                    <button 
                    type="submit"
                    className="btn-primarypy-1 whitespace-nowrap">
                        Add admin
                    </button>
                </div>
            </form>

            <h2>Existing admins</h2>
            <table className="basic">
                <thead>
                    <tr >
                        <th className="text-left">Admin Google email</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <Spinner fullWidth={true}/>
                            </td>
                        </tr>
                    )}
                    {adminEmails.length>0 && adminEmails.map(adminemail=>(
                        <tr key={adminemail._id}>
                            <td>{adminemail.email}</td>
                            <td>
                                {adminemail.createdAt && prettyDate(adminemail.createdAt)}
                            </td>
                            <td>
                                <button type="button"
                                onClick={()=>deleteAdmin(adminemail)}
                                className="btn-red">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal})=>(
    <AdminsPage swal={swal} />
))