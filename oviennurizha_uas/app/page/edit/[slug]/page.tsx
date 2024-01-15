'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface EditPageProps {
  params: {
    slug: string;
  };
}

interface Produk {
  id: number;
  attributes: {
    NamaBarang: string;
    JenisBarang: string;
    StokBarang: number;
    HargaBarang: number;
    Suplyer: string;
  };
}

const EditPage = ({ params }: EditPageProps) => {
  const router = useRouter()
  const id = params.slug
  const [formData, setFormData] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Suplyer:""
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(`http://localhost:1337/api/produks/${id}`);
          const mahasiswaData = response.data.data as Produk;
          setFormData({
            NamaBarang: mahasiswaData.attributes.NamaBarang,
            JenisBarang: mahasiswaData.attributes.JenisBarang,
            StokBarang: mahasiswaData.attributes.StokBarang,
            HargaBarang: mahasiswaData.attributes.HargaBarang,
            Suplyer: mahasiswaData.attributes.Suplyer,
          });
        }
      } catch (error) {
        console.error('Error fetching Produk:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:1337/api/produks/${id}`, {
        data: formData,
      });
      // Redirect to the Mahasiswa list page after successful submission
      router.push('/');
    } catch (error) {
      console.error('Error updating Mahasiswa:', error);
    }
  };

  return (
    <div className='wraper-form'>
          <form className='form'  style={{width:'80%'}}>
            <label>
              Nama Barang:
              <input
                type="text"
                name="NamaBarang"
                value={formData.NamaBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Jenis Barang:
              <input
                type="text"
                name="JenisBarang"
                value={formData.JenisBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Stok Barang:
              <input
                type="number"
                name="StokBarang"
                value={formData.StokBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Harga Barang:
              <input
                type="number"
                name="HargaBarang"
                value={formData.HargaBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Suplier Barang:
              <input
                type="text"
                name="Suplyer"
                value={formData.Suplyer}
                onChange={handleChange}
              />
            </label>
            <div className='btn-wraper'>
            <button className="btn btn-green" type="button" onClick={handleSubmit}>
              Simpan
            </button>
            <button className="btn btn-red" type="button" onClick={handleSubmit}>
              Batal
            </button>
            </div>
          </form>
    </div>
  );
};

export default EditPage;
