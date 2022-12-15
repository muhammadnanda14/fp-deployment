import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("asc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePhoto = (id) => {
    fetch("https://gallery-app-server.vercel.app/photos" + id, { method: "DELETE" })
      .then((respon) => respon.json())
      .then((data) => {
        data.error ? setError(data.error) : setPhotos((poto) => poto.filter((x) => x.id !== id));
      });
  };

  const filt = async () => {
    setLoading(true);
    try {
      switch (true) {
        case sort === "asc":
          const url = await fetch("https://gallery-app-server.vercel.app/photos");
          const respon = await url.json();
          setPhotos(respon);
          setLoading(false);
          // conditional rendering use && operator
          // yang artinya hanya membuat kondisi true saja, tidak pake else
          {
            submited &&
              fetch(`https://gallery-app-server.vercel.app/photos?q=${submited}`)
                .then((respon) => respon.json())
                .then((datas) => {
                  setPhotos(datas);
                  setLoading(false);
                });
          }
          break;
        case sort === "desc":
          fetch("https://gallery-app-server.vercel.app/photos/?_sort=id&_order=desc")
            .then((respon) => respon.json())
            .then((datas) => {
              const data = datas.sort((a, b) => b["id"] - a.id);
              setPhotos(data);
              setLoading(false);
            });
          if (submited) {
            const url = await fetch("https://gallery-app-server.vercel.app/photos?_sort=id&_order=desc&q=" + submited);
            const respon = await url.json();
            setPhotos(respon);
            setLoading(false);
          }
          break;
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    filt();
  }, [sort, submited]);

  if (error) return <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select onChange={(e) => setSort(e.target.value)} data-testid="sort" className="form-select" style={{}}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input type="text" data-testid="search" onChange={(e) => setSearch(e.target.value)} className="form-input" />
            <input type="submit" value="Search" data-testid="submit" className="form-btn" />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>Loading...</h1>
          ) : (
            photos.map((photo) => {
              return <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
