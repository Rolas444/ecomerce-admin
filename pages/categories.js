import Layout from "@/components/Layout"
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

export const Categories = ({ swal }) => {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    const saveCategory = async (ev) => {
        ev.preventDefault();
        const data = { 
            name, 
            parentCategory, 
            properties: properties.map(p=>({
                name: p.name,
                values:p.values.split(',')
            }))
         }
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setProperties(
            category.properties.map(({name, values})=>({
                name,
                values: values.join(',')
            }))
        );
        setParentCategory(category.parent?._id);
    };

    const deleteCategory = (category) => {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${category.name}"?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
            // didOpen:()=>{

            // },
            // didClose:()=>{

            // }
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    };

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        });
    }

    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    const removeProperty = (indexToRemove) => {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <Layout>
            <div>Categories</div>
            <label>{editedCategory ? `Edit category ${editedCategory.name}` : 'New Category name'}</label>
            <form onSubmit={saveCategory} >
                <div className="flex gap-1">
                    <input type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mb-0"
                        placeholder="category name" />
                    <select className="mb-0"
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory?._id}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id} >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button
                        type="button"
                        onClick={addProperty}
                        className="btn-default text-sm mb-2">
                        Add new property
                    </button>
                    {properties?.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="proerty name (example: color)" />
                            <input type="text"
                                className="mb-0"
                                value={property.values}
                                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                placeholder="values, comma separated" />
                            <button
                                type="button"
                                onClick={() => removeProperty(index)}
                                className="btn-default">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex gap-1">
                {editedCategory && (
                        <button 
                            onClick={()=>{
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default" >
                            Cancel
                        </button>
                        )}
                        <button type="submit" className="btn-primary py-1">Save</button>
                </div>
                
                

            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button onClick={() => editCategory(category)}
                                        className="btn-primary
                                mr-1">Edit</button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-primary">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}


        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));

