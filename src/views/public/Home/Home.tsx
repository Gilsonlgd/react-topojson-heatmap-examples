import './Home.css';

const gridItems = [
  { id: 1, title: 'Seção 1' },
  { id: 2, title: 'Seção 2' },
  { id: 3, title: 'Seção 3' },
  { id: 4, title: 'Seção 4' },
  { id: 5, title: 'Seção 5' },
  { id: 6, title: 'Seção 6' },
  { id: 7, title: 'Seção 7' },
  { id: 8, title: 'Seção 8' },
];

function Home(): JSX.Element {
  return (
    <div className="container-fluid p-4">
      <div className="row g-4">
        {gridItems.map(item => (
          <div key={item.id} className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-header">
                <h5 className="card-title mb-0">{item.title}</h5>
              </div>
              <div className="card-body grid-cell-content" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
