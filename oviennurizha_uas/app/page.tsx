'use client'
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Modal from "react-modal";

interface Produk {
  id: number;
  attributes: {
   NamaBarang: string;
    JenisBarang: string;
    StokBarang: number;
    HargaBarang: number;
    Supplyer:string;
  };
}

async function getData(): Promise<Produk[]> {
  try {
    const response = await axios.get('http://localhost:1337/api/produks');
    return response.data.data as Produk[];
  } catch (error) {
    throw new Error("Gagal Mendapat Data");
  }
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<Produk[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newProduk, setNewProduk] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Supplyer:""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData || []);
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  const handleShow = (produk: Produk) => {
    setSelectedProduk(produk);
    setModalIsOpen(true);
  };
  const handleCreate = () => {
    setAddModalIsOpen(true)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduk((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:1337/api/produks', {
        data: newProduk
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding Produk:', error);
    }
  };
  

  const handleDelete = async (produk: Produk) => {
    const userConfirmed = window.confirm(`Deleting Produk: ${produk.attributes.NamaBarang} - ${produk.attributes.JenisBarang}`);
    if (userConfirmed) {
    try {
      // Implement your delete logic here
      await axios.delete(`http://localhost:1337/api/produks/${produk.id}`);
      // Fetch updated data after deletion
      const updatedData = await getData();
      setData(updatedData || []);
    } catch (error) {
      console.error('Error deleting Mahasiswa:', error);
    }
  } else{
    window.location.reload();
  }
};


  const closeModal = () => {
    setSelectedProduk(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <h1 style={{ color: "blue" }}>Tabel Data Produk</h1>
      <div className="form">
      <table className="table">
            
            
            <thead>
          <tr>
            <th>NO</th>
            <th>Nama Barang</th>
            <th>Stok</th>
            <th>Aksi</th>
            <th>Upgrade</th>
          </tr>
        </thead>
        
        <tbody>
        {data.map((produk) => (
          <tr key={produk.id}>
          <td>{produk.id}</td>
          <td>{produk.attributes.NamaBarang}</td>
          <td>{produk.attributes.StokBarang}</td>
          <td>
              <button className="btn btn-blue" onClick={() => handleShow(produk)}>Detail</button>
            </td>
            <td>
              <button className="btn btn-green" onClick={() => handleCreate()}>Tambah</button>
              <button className="btn btn-yellow" onClick={() => router.push(`/page/edit/${produk.id}`)}>Edit</button>
              <button className="btn btn-red" onClick={() => handleDelete(produk)}>Hapus</button>
            </td>
          </tr>
                ))}
        </tbody>
      </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detail Mahasiswa">

        {selectedProduk && (
        <div>
            <h2>Detail Produk</h2>
            <p>Nama Barang: {selectedProduk.attributes.NamaBarang}</p>
            <p>Jenis Barang: {selectedProduk.attributes.JenisBarang}</p>
            <p>Stok Barang: {selectedProduk.attributes.StokBarang}</p>
            <p>Harga Barang: {selectedProduk.attributes.HargaBarang}</p>
            <p>Suplier: {selectedProduk.attributes.Supplyer}</p>
            <button className="btn btn-red" onClick={closeModal}>Tutup</button>
        </div>
        )}
      </Modal>

      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={() => setAddModalIsOpen(false)}
        contentLabel="Form Tambah Barang">
        <div>
            <h2>Edit Produk</h2>
            <form className="form">
              <label>
                Nama Barang:
                <input type="text" name="NamaBarang" onChange={handleInputChange} />
              </label>

              <label>
                Jenis Barang:
                <input type="text" name="JenisBarang" onChange={handleInputChange} />
              </label>

              <label>
                Stok Barang:
                <input type="text" name="StokBarang" onChange={handleInputChange} />
              </label>

              <label>
                Harga Barang:
                <input type="text" name="HargaBarang" onChange={handleInputChange} />
              </label>

              <label>
                Suplyer:
                <input type="text" name="Supplyer" onChange={handleInputChange} />
              </label>
              <div className="btn-wraper">
              <button type="button" className="btn btn-green" onClick={handleAddSubmit}>Simpan</button>
              <button type="button" className="btn btn-red" onClick={() => setAddModalIsOpen(false)}>Batal</button>
              </div>
            </form>
          </div>
      </Modal>

    </>
  );
}